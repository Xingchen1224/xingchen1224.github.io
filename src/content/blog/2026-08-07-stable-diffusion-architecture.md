---
title: "Inside Stable Diffusion"
date: 2026-08-07
excerpt: "How an image model turns a sentence into a picture — the three parts, the loop in the middle, and what changed across three generations."
wide: false
categories:
  - blog
tags:
  - diffusion
  - generative-models
  - computer-vision
---

<p class="sd-note sd-note--lead"><strong>A note on how this was written.</strong>
I put this post together in collaboration with AI agents. Using AI to work out
how AI works turned out to be a genuinely good way to learn it — there is a
longer note at the end.</p>

You type a sentence and get a picture. In between are three networks and one
loop that runs ten times.

Press play.

<style>
.sdv{margin:2em 0 2.5em;}
.sdv figure{margin:0;}
.sdv__frame{background:var(--bg-elev);border:1px solid var(--line);border-radius:16px;padding:1.2rem 1.1rem 1rem;box-shadow:var(--shadow-card);overflow:hidden;}
.sdv__bar{display:flex;flex-wrap:wrap;align-items:center;gap:0.6rem;margin-top:1rem;padding-top:0.9rem;border-top:1px solid var(--line);}
.sdv__btn{font-family:var(--font-mono);font-size:0.76rem;letter-spacing:0.04em;display:inline-flex;align-items:center;gap:0.45em;padding:0.44rem 0.85rem;border-radius:9px;border:1px solid var(--line);background:var(--bg-subtle);color:var(--ink);cursor:pointer;transition:border-color .15s ease,color .15s ease,background .15s ease;}
.sdv__btn:hover{border-color:var(--accent);color:var(--accent);}
.sdv__btn[aria-pressed="true"]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);}
.sdv__status{font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-faint);margin-left:auto;text-align:right;line-height:1.55;}
.sdv__status b{color:var(--accent);font-weight:500;}
.sdv figcaption{font-size:0.84rem;color:var(--ink-faint);margin-top:0.9rem;line-height:1.65;}
.sdv svg{display:block;width:100%;height:auto;}

/* ---- pipeline diagram ---- */
.sdv-node{color:var(--ink-faint);}
.sdv-node .sdv-card{fill:var(--bg-subtle);stroke:var(--line);stroke-width:1.25;transition:fill .35s ease,stroke .35s ease;}
.sdv-node.on{color:var(--accent);}
.sdv-node.on .sdv-card{fill:url(#sdv-fill);stroke:var(--accent);}
.sdv-node .sdv-title{font-family:var(--font-display);font-size:15px;font-weight:600;fill:var(--ink);}
.sdv-node .sdv-sub{font-family:var(--font-mono);font-size:10.5px;fill:var(--ink-faint);transition:fill .35s ease;}
.sdv-node.on .sdv-sub{fill:var(--accent);}
.sdv-ico{width:17px;height:17px;stroke:currentColor;stroke-width:1.5;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:color .35s ease;}
.sdv-wire{fill:none;stroke:var(--line);stroke-width:1.75;stroke-linecap:round;}
.sdv-wire--dash{stroke-dasharray:4 6;}
.sdv-region{fill:var(--accent);opacity:0.028;transition:opacity .35s ease;}
.sdv-region.on{opacity:0.075;}
.sdv-regionline{fill:none;stroke:var(--line);stroke-width:1.25;stroke-dasharray:2 6;stroke-linecap:round;transition:stroke .35s ease;}
.sdv-regionline.on{stroke:var(--accent);}
.sdv-tag{font-family:var(--font-mono);font-size:10px;fill:var(--ink-faint);letter-spacing:0.07em;}
.sdv-pill{fill:var(--bg-elev);stroke:var(--line);stroke-width:1;transition:stroke .35s ease;}
.sdv-pill.on{stroke:var(--accent);}
.sdv-packet{fill:var(--accent);}

/* ---- noise slider ---- */
.sdv-canvas{display:block;width:100%;height:auto;image-rendering:pixelated;border-radius:12px;border:1px solid var(--line);background:var(--track);}
.sdv-canvas--smooth{image-rendering:auto;}
.sdv__panes{display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start;}
.sdv__panes--three{grid-template-columns:1fr 1fr 1fr;}
.sdv__lbl{font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-faint);letter-spacing:0.04em;}
.sdv-canvas--muted{opacity:0.32;filter:grayscale(1);transition:opacity .2s ease,filter .2s ease;}
.sdv__pane h4{font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-faint);margin:0 0 0.55rem;font-weight:400;}
.sdv__mix{display:flex;height:8px;border-radius:99px;overflow:hidden;margin:1rem 0 0.45rem;background:var(--track);}
.sdv__mix i{display:block;transition:width .12s linear;}
.sdv__mix i:first-child{background:var(--accent);}
.sdv__mix i:last-child{background:var(--ink-faint);opacity:.6;}
.sdv__legend{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-faint);}
.sdv input[type=range]{flex:1;min-width:150px;accent-color:var(--accent);}

/* ---- version switcher ---- */
.sde__tabs{display:flex;gap:0.4rem;margin-bottom:1.1rem;flex-wrap:wrap;}
.sde__stage{display:grid;grid-template-columns:1.15fr 1fr 0.8fr;gap:1.1rem;align-items:start;}
.sde__col h4{font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.09em;text-transform:uppercase;color:var(--ink-faint);margin:0 0 0.6rem;font-weight:400;}
.sde__col--mid{align-self:stretch;display:flex;flex-direction:column;}
.sde__col--mid .sde__core{margin-top:auto;margin-bottom:auto;}
.sde__stack{display:flex;flex-direction:column;gap:0.4rem;}
.sde__enc{border:1px solid var(--line);border-radius:10px;padding:0.55rem 0.7rem;background:var(--surface-2);overflow:hidden;transition:opacity .3s ease,max-height .3s ease,padding .3s ease,margin .3s ease,border-color .3s ease;max-height:70px;}
.sde__enc[hidden]{display:block;opacity:0;max-height:0;padding-top:0;padding-bottom:0;border-width:0;margin-top:-0.4rem;}
.sde__enc b{display:block;font-family:var(--font-display);font-size:0.86rem;color:var(--ink);font-weight:600;}
.sde__enc span{font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-faint);}
.sde__enc--hero{border-color:var(--accent);background:var(--accent-soft);}
.sde__core{border:1px solid var(--accent);background:var(--accent-soft);border-radius:12px;padding:1rem 0.8rem;text-align:center;}
.sde__core b{display:block;font-family:var(--font-display);font-size:1.15rem;color:var(--ink);}
.sde__core span{display:block;font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-faint);margin-top:0.18rem;}
.sde__obj{color:var(--accent) !important;margin-top:0.5rem !important;}
.sde__planes{position:relative;height:76px;}
.sde__planes i{position:absolute;left:0;width:58px;height:38px;border:1px solid var(--accent);border-radius:5px;background:var(--surface-2);transition:transform .35s ease,opacity .35s ease;}
.sde__note{font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-faint);margin:0.55rem 0 0;line-height:1.5;}
.sde__bars{margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--line);display:grid;gap:0.55rem;}
.sde__bar{display:grid;grid-template-columns:8.5rem 1fr auto;gap:0.7rem;align-items:center;font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-faint);}
.sde__bar u{text-decoration:none;}
.sde__track{height:7px;border-radius:99px;background:var(--track);overflow:hidden;}
.sde__fill{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .4s cubic-bezier(.2,.7,.2,1);}
.sde__bar b{color:var(--ink);font-weight:500;min-width:5.5rem;text-align:right;}

.sd-scroll{overflow-x:auto;margin:1.5em 0;}
.sd-scroll table.sd-rel{min-width:660px;width:100%;border-collapse:collapse;font-size:0.9rem;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
.sd-rel th{background:var(--surface-2);color:var(--ink);text-align:left;font-weight:600;}
.sd-rel th,.sd-rel td{border-bottom:1px solid var(--line);padding:0.5rem 0.75rem;}
.sd-rel tr:last-child td{border-bottom:0;}
.sd-rel td:nth-child(2),.sd-rel td:nth-child(3){font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-soft);white-space:nowrap;}
.sd-rel td:nth-child(4){font-size:0.82rem;color:var(--ink-soft);}
.sd-rel td:nth-child(5){white-space:nowrap;font-size:0.82rem;}

/* ---- colophon ---- */
.sd-note--lead{margin:0 0 2em;}
.sd-note{border-left:2px solid var(--accent);background:var(--surface-2);border-radius:0 10px 10px 0;padding:0.9rem 1.1rem;margin:2.5em 0 0;color:var(--ink-soft);font-size:0.92rem;line-height:1.65;}
.sd-note strong{color:var(--ink);font-weight:600;}

/* ---- schedule chart ---- */
#sd-paths svg{max-width:470px;margin:0 auto;}
.sde-axis{stroke:var(--ink-faint);stroke-width:1;opacity:0.55;}
.sde-path{fill:none;stroke-width:2.5;stroke-linecap:round;}
.sde-path--cos{stroke:var(--ink-faint);}
.sde-path--rf{stroke:var(--accent);}
.sde-sw--cos{fill:var(--ink-faint);}
.sde-sw--rf{fill:var(--accent);}

@media (max-width:620px){.sde__stage{grid-template-columns:1fr;}.sde__planes{height:64px;}}
@media (max-width:640px){.sdv__panes,.sdv__panes--three{grid-template-columns:1fr;}.sdv__status{margin-left:0;text-align:left;width:100%;}.sde__bar{grid-template-columns:7rem 1fr auto;}}
@media (prefers-reduced-motion:reduce){.sdv-node .sdv-card,.sdv-node .sdv-sub,.sdv-ico,.sdv-region,.sdv-regionline,.sdv__mix i,.sde__enc,.sde__planes i,.sde__fill{transition:none;}}
</style>

<div class="sdv" id="sd-pipe">
<figure>
<div class="sdv__frame">
<svg viewBox="0 0 700 640" role="img" aria-label="The Stable Diffusion pipeline. A prompt goes through a text encoder into a list of numbers. Separately, random static enters latent space, where a U-Net and a scheduler take turns for ten steps, guided by the text. A VAE decoder then turns the result into a 512 by 512 image.">
<defs>
<linearGradient id="sdv-fill" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.20"/><stop offset="100%" stop-color="var(--accent-2)" stop-opacity="0.08"/></linearGradient>
<linearGradient id="sdv-dot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="var(--accent)"/><stop offset="100%" stop-color="var(--accent-2)"/></linearGradient>
<filter id="sdv-soft" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.10"/></filter>
<filter id="sdv-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<marker id="sdv-ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0.5 1 L7 4 L0.5 7" fill="none" stroke="var(--line)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></marker>
<symbol id="i-prompt" viewBox="0 0 16 16"><path d="M2.5 4.5h11M2.5 8h8M2.5 11.5h5.5"/></symbol>
<symbol id="i-chip" viewBox="0 0 16 16"><rect x="4.2" y="4.2" width="7.6" height="7.6" rx="1.6"/><path d="M6.6 1.6v2.6M9.4 1.6v2.6M6.6 11.8v2.6M9.4 11.8v2.6M1.6 6.6h2.6M1.6 9.4h2.6M11.8 6.6h2.6M11.8 9.4h2.6"/></symbol>
<symbol id="i-vector" viewBox="0 0 16 16"><path d="M3 10.6V5.4M6.3 12.4V3.6M9.7 9.8V6.2M13 11.6V4.4"/></symbol>
<symbol id="i-noise" viewBox="0 0 16 16"><circle cx="3.2" cy="4" r="1.05" fill="currentColor" stroke="none"/><circle cx="8" cy="2.9" r="1.05" fill="currentColor" stroke="none"/><circle cx="12.8" cy="5" r="1.05" fill="currentColor" stroke="none"/><circle cx="5.1" cy="8.3" r="1.05" fill="currentColor" stroke="none"/><circle cx="10.6" cy="9.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="3.4" cy="12.5" r="1.05" fill="currentColor" stroke="none"/><circle cx="8.4" cy="13.1" r="1.05" fill="currentColor" stroke="none"/><circle cx="13" cy="11.4" r="1.05" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-unet" viewBox="0 0 16 16"><path d="M2.4 3.4L6 12.4h4l3.6-9"/></symbol>
<symbol id="i-minus" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.9"/><path d="M5.2 8h5.6"/></symbol>
<symbol id="i-expand" viewBox="0 0 16 16"><path d="M6.2 2.6H2.6V6.2M9.8 2.6h3.6V6.2M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/></symbol>
<symbol id="i-image" viewBox="0 0 16 16"><rect x="2.2" y="3.2" width="11.6" height="9.6" rx="1.6"/><circle cx="5.9" cy="6.6" r="1.1"/><path d="M2.6 11.4l3.3-3.1 2.4 2.2 2.5-2.7 2.9 3.3"/></symbol>
</defs>
<rect class="sdv-region" id="loopfill" x="16" y="280" width="668" height="230" rx="18"/>
<rect class="sdv-regionline" id="loopbox" x="16" y="280" width="668" height="230" rx="18" fill="none"/>
<text class="sdv-tag" x="40" y="494">LATENT SPACE · A 64 × 64 SKETCH, NOT A PICTURE</text>
<g id="loopbadge"><rect class="sdv-pill" id="loopbadgebg" x="548" y="284" width="112" height="24" rx="12"/><text class="sdv-tag" id="loopcount" x="604" y="300" text-anchor="middle">× 10 STEPS</text></g>
<text class="sdv-tag" x="392" y="478" text-anchor="end">z</text>
<path class="sdv-wire" id="w-p2e" marker-end="url(#sdv-ah)" d="M492 78 V92"/>
<path class="sdv-wire" id="w-e2m" marker-end="url(#sdv-ah)" d="M534 160 V174"/>
<path class="sdv-wire sdv-wire--dash" id="w-m2u" marker-end="url(#sdv-ah)" d="M534 242 V258 Q534 274 518 274 H201 Q185 274 185 290 V306"/>
<path class="sdv-wire" id="w-n2u" marker-end="url(#sdv-ah)" d="M141 242 V306"/>
<path class="sdv-wire" id="w-u2s" marker-end="url(#sdv-ah)" d="M330 355 H364"/>
<path class="sdv-wire" id="w-s2u" marker-end="url(#sdv-ah)" d="M505 398 V418 Q505 430 493 430 H197 Q185 430 185 418 V404"/>
<path class="sdv-wire" id="w-s2v" marker-end="url(#sdv-ah)" d="M620 398 V540"/>
<path class="sdv-wire" id="w-v2i" marker-end="url(#sdv-ah)" d="M370 577 H336"/>
<text class="sdv-tag" x="548" y="256">GUIDANCE</text>
<g class="sdv-node" id="n-prompt"><rect class="sdv-card" filter="url(#sdv-soft)" x="300" y="16" width="384" height="62" rx="12"/><use class="sdv-ico" href="#i-prompt" x="318" y="38" width="17" height="17"/><text class="sdv-title" x="346" y="42">Prompt</text><text class="sdv-sub" x="346" y="60">“a cute puppy is drinking a cup of latte”</text></g>
<g class="sdv-node" id="n-clip"><rect class="sdv-card" filter="url(#sdv-soft)" x="384" y="98" width="300" height="62" rx="12"/><use class="sdv-ico" href="#i-chip" x="402" y="120" width="17" height="17"/><text class="sdv-title" x="430" y="124">Text encoder</text><text class="sdv-sub" x="430" y="142">words → numbers</text></g>
<g class="sdv-node" id="n-embed"><rect class="sdv-card" filter="url(#sdv-soft)" x="384" y="180" width="300" height="62" rx="12"/><use class="sdv-ico" href="#i-vector" x="402" y="202" width="17" height="17"/><text class="sdv-title" x="430" y="206">Meaning</text><text class="sdv-sub" x="430" y="224">77 × 768 numbers</text></g>
<g class="sdv-node" id="n-noise"><rect class="sdv-card" filter="url(#sdv-soft)" x="16" y="180" width="250" height="62" rx="12"/><use class="sdv-ico" href="#i-noise" x="34" y="202" width="17" height="17"/><text class="sdv-title" x="62" y="206">Static</text><text class="sdv-sub" x="62" y="224">pure random noise</text></g>
<g class="sdv-node" id="n-unet"><rect class="sdv-card" filter="url(#sdv-soft)" x="40" y="312" width="290" height="86" rx="12"/><use class="sdv-ico" href="#i-unet" x="58" y="346" width="17" height="17"/><text class="sdv-title" x="86" y="344">U-Net</text><text class="sdv-sub" x="86" y="363">guesses the noise</text><text class="sdv-sub" x="86" y="379">860M weights</text></g>
<g class="sdv-node" id="n-sched"><rect class="sdv-card" filter="url(#sdv-soft)" x="370" y="312" width="290" height="86" rx="12"/><use class="sdv-ico" href="#i-minus" x="388" y="346" width="17" height="17"/><text class="sdv-title" x="416" y="344">Scheduler</text><text class="sdv-sub" x="416" y="363">subtracts the guess</text><text class="sdv-sub" x="416" y="379">no weights at all</text></g>
<g class="sdv-node" id="n-vae"><rect class="sdv-card" filter="url(#sdv-soft)" x="370" y="546" width="290" height="62" rx="12"/><use class="sdv-ico" href="#i-expand" x="388" y="568" width="17" height="17"/><text class="sdv-title" x="416" y="572">Decoder</text><text class="sdv-sub" x="416" y="590">sketch → pixels</text></g>
<g class="sdv-node" id="n-img"><rect class="sdv-card" filter="url(#sdv-soft)" x="40" y="546" width="290" height="62" rx="12"/><use class="sdv-ico" href="#i-image" x="58" y="568" width="17" height="17"/><text class="sdv-title" x="86" y="572">Image</text><text class="sdv-sub" x="86" y="590">512 × 512 pixels</text></g>
<g id="latent-cells" transform="translate(400,452)"></g>
<g id="packet" opacity="0" filter="url(#sdv-glow)"><circle class="sdv-packet" id="pk2" r="2.5" opacity="0.3"/><circle class="sdv-packet" id="pk1" r="4" opacity="0.6"/><circle id="pk0" r="6" fill="url(#sdv-dot)"/></g>
<g id="packet-b" opacity="0" filter="url(#sdv-glow)"><circle class="sdv-packet" id="pb2" r="2.5" opacity="0.3"/><circle class="sdv-packet" id="pb1" r="4" opacity="0.6"/><circle id="pb0" r="6" fill="url(#sdv-dot)"/></g>
</svg>
</div>
<div class="sdv__bar">
<button class="sdv__btn" id="pipe-play" type="button" aria-pressed="false">▶ Play</button>
<button class="sdv__btn" id="pipe-reset" type="button">↺ Restart</button>
<span class="sdv__status" id="pipe-status">Ready</span>
</div>
<figcaption>The two boxes in the middle take turns. Everything else runs once.</figcaption>
</figure>
</div>

## It works on a sketch

The surprise is that the U-Net never sees a picture. It works on a small
stand-in — a `64 × 64` grid the model uses instead of the full image.

A `512 × 512` photo is 786,432 numbers. The sketch is 16,384. That is **48×
smaller**, and it is the whole reason this runs on a normal graphics card
instead of a datacentre.

Only at the very end does the decoder blow the sketch up into pixels.

## The loop

Each time round, two things happen:

1. The **U-Net** looks at the sketch and guesses which parts are noise.
2. The **scheduler** subtracts a little of that guess.

Repeat ten times and a picture falls out. The scheduler has no learned
weights — it is arithmetic. All the intelligence is in the guess.

How much noise to remove is fixed in advance by a schedule. Drag the slider:

<div class="sdv" id="sd-noise">
<figure>
<div class="sdv__frame">
<div class="sdv__panes">
<div class="sdv__pane"><h4>The sketch · 64×64</h4><canvas class="sdv-canvas" id="nz-latent" width="64" height="64" role="img" aria-label="The internal sketch at the current step, resolving from pure static into blurry structure. Its colours are not the picture's colours."></canvas></div>
<div class="sdv__pane"><h4>After decoding · 512×512</h4><canvas class="sdv-canvas sdv-canvas--smooth" id="nz-image" width="256" height="256" role="img" aria-label="The picture the decoder produces from the current sketch."></canvas></div>
</div>
<div class="sdv__mix"><i id="nz-sig"></i><i id="nz-noi"></i></div>
<div class="sdv__legend"><span id="nz-siglab">picture</span><span id="nz-noilab">noise</span></div>
</div>
<div class="sdv__bar">
<button class="sdv__btn" id="nz-play" type="button" aria-pressed="false">▶ Run</button>
<input type="range" id="nz-range" min="0" max="1000" value="0" step="1" aria-label="Progress through sampling, from pure static on the left to the finished sketch on the right."/>
<span class="sdv__status" id="nz-status">step 0</span>
</div>
<figcaption>The left panel is not a small picture — its colours are nothing like the final ones. That is what the decoder is for. (An illustration: the target is drawn by hand, but the noise mixture follows the real schedule.)</figcaption>
</figure>
</div>

Notice how little the last few steps change. That is the shape of the schedule,
and later versions fix it.

## How the words get in

The text never enters as a picture-shaped thing. Instead, at every layer of the
U-Net, each patch of the sketch asks the sentence a question: *which words apply
to me?* The answer nudges that patch. This is **cross-attention**, and it is the
only place the prompt touches anything.

Run it twice — once with your prompt, once with an empty one — and exaggerate the
difference, and prompts bite harder. That is the "guidance scale" slider in every
interface. It is also why each step costs two passes, not one.

## Starting from a picture instead

Everything so far began with pure static. Feed the model a picture instead and
almost nothing changes — which is the point.

The decoder you met at the end runs in reverse too. Push your image through it
backwards and you get a sketch: the same `64 × 64` grid, only this one *means*
something already. Add noise to it — but stop partway — and hand it to the same
loop.

How far you noise it is the **strength** dial, the one every interface exposes
and nobody explains. It decides where on the schedule you start:

<div class="sdv" id="sd-i2i">
<figure>
<div class="sdv__frame">
<div class="sdv__panes sdv__panes--three">
<div class="sdv__pane"><h4>Your picture</h4><canvas class="sdv-canvas sdv-canvas--smooth" id="i2-in" width="256" height="256" role="img" aria-label="The input picture handed to the model."></canvas></div>
<div class="sdv__pane"><h4>Where the loop starts</h4><canvas class="sdv-canvas" id="i2-mid" width="64" height="64" role="img" aria-label="The input encoded to a sketch and noised part of the way, which is where denoising begins."></canvas></div>
<div class="sdv__pane"><h4>What comes back</h4><canvas class="sdv-canvas sdv-canvas--smooth" id="i2-out" width="256" height="256" role="img" aria-label="The result, which drifts further from the input as strength rises."></canvas></div>
</div>
</div>
<div class="sdv__bar">
<label class="sdv__lbl" for="i2-range">strength</label>
<input type="range" id="i2-range" min="0" max="100" value="45" step="1" aria-label="Denoising strength, from 0 (return the input untouched) to 1 (ignore the input entirely)"/>
<span class="sdv__status" id="i2-status"></span>
</div>
<figcaption id="i2-cap"></figcaption>
</figure>
</div>

Slide it all the way up and the input is gone — every trace of it has been
noised away, and you are back to text-to-image. That is the whole relationship:
**text-to-image is image-to-image at strength 1.** There is no second model, no
second pipeline. Only a different place to start.

Slide it down and the loop has fewer steps left to run, which is why img2img at
strength 0.4 is roughly half the wait.

| | text → image | image → image |
| --- | --- | --- |
| Encoder runs? | no | **yes**, once |
| Starts from | pure static | your picture, part-noised |
| Steps run | all 10 | strength × 10 |
| At strength 1 | — | identical to text → image |

Inpainting is the same trick with a mask: noise only the region you painted,
leave the rest of the sketch alone, and the loop repairs the hole so that it
agrees with its surroundings.

## How it evolved

Four generations in, the only piece still recognisable is the sketch.

<div class="sdv" id="sd-evo">
<figure>
<div class="sdv__frame">
<div class="sde__tabs" role="group" aria-label="Stable Diffusion version">
<button class="sdv__btn" type="button" id="tab-v1" aria-pressed="true" data-v="0">SD 1.x</button>
<button class="sdv__btn" type="button" id="tab-v2" aria-pressed="false" data-v="1">SD 2.x</button>
<button class="sdv__btn" type="button" id="tab-v3" aria-pressed="false" data-v="2">SDXL</button>
<button class="sdv__btn" type="button" id="tab-v4" aria-pressed="false" data-v="3">SD 3.x</button>
</div>
<div class="sde__stage" aria-live="polite">
<div class="sde__col">
<h4>Reads the words</h4>
<div class="sde__stack" id="ev-enc"></div>
<p class="sde__note" id="ev-ctx"></p>
</div>
<div class="sde__col sde__col--mid">
<h4>Does the work</h4>
<div class="sde__core" id="ev-core"><b id="ev-core-name"></b><span id="ev-core-p"></span><span class="sde__obj" id="ev-obj"></span></div>
</div>
<div class="sde__col">
<h4>The sketch</h4>
<div class="sde__planes" id="ev-planes"></div>
<p class="sde__note" id="ev-lat"></p>
</div>
</div>
<div class="sde__bars" id="ev-bars"></div>
</div>
<figcaption id="ev-cap"></figcaption>
</figure>
</div>

**1.x** is the baseline every diagram above describes: one CLIP text encoder,
one U-Net, a 4-channel sketch at 512×512. 1.4 and 1.5 are the same architecture
— 1.5 simply trained for longer, which is why it is the one that stuck and the
one most fine-tunes still descend from.

**2.x** barely changed the shape. It swapped in a bigger text encoder and a
steadier training target. It is remembered as a downgrade anyway — the training
images had been filtered much more aggressively, and a better reader of thinner
material still reads less.

**SDXL** made everything bigger rather than different: three times the U-Net, a
second text encoder glued alongside the first, and 1024×1024 output. Same
4-channel sketch, same curved schedule. **SDXL Turbo** then distilled it down to
one to four steps by training it against a discriminator.

**3.x** threw out the U-Net. In its place is a transformer that treats sketch
patches and words as one long list and lets them attend to each other directly,
instead of the prompt reaching in from the side. Two more things changed:

- **A straight schedule.** The old curve wasted its final steps. The new one
  moves at a constant rate, so fewer steps are needed.
- **A richer sketch.** Four channels became sixteen — four times the detail for
  the decoder to work with. That ceiling had been in place since 2022.

<div class="sdv" id="sd-paths">
<figure>
<div class="sdv__frame">
<svg viewBox="0 0 420 190" role="img" aria-label="A plot of how much picture is present against step. The old cosine schedule curves; the new rectified-flow schedule is a straight diagonal.">
<line class="sde-axis" x1="44" y1="150" x2="396" y2="150"/><line class="sde-axis" x1="44" y1="18" x2="44" y2="150"/>
<text class="sdv-tag" x="44" y="170">finished</text><text class="sdv-tag" x="396" y="170" text-anchor="end">pure static</text>
<text class="sdv-tag" x="38" y="24" text-anchor="end">1</text><text class="sdv-tag" x="38" y="154" text-anchor="end">0</text>
<text class="sdv-tag" x="12" y="94" text-anchor="middle" transform="rotate(-90 12 94)">PICTURE</text>
<polyline class="sde-path sde-path--cos" id="path-cos" points=""/>
<polyline class="sde-path sde-path--rf" id="path-rf" points=""/>
<g><rect x="252" y="26" width="14" height="3" rx="1.5" class="sde-sw--cos"/><text class="sdv-tag" x="274" y="32">SD 1 &amp; 2</text><rect x="252" y="46" width="14" height="3" rx="1.5" class="sde-sw--rf"/><text class="sdv-tag" x="274" y="52">SD 3</text></g>
</svg>
</div>
<figcaption>Read right to left, the way sampling runs. The old schedule races at the start then crawls, so its last steps cost compute and change almost nothing. The straight line spends every step equally.</figcaption>
</figure>
</div>

### The models and their licences

<div class="sd-scroll">
<table class="sd-rel">
<thead><tr><th>Model</th><th>Released</th><th>Backbone</th><th>Licence</th><th>Weights</th></tr></thead>
<tbody>
<tr><td>SD 1.4</td><td>Aug 2022</td><td>U-Net 860M</td><td>CreativeML OpenRAIL-M</td><td><a href="https://huggingface.co/CompVis/stable-diffusion-v1-4" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 1.5</td><td>Oct 2022</td><td>U-Net 860M</td><td>CreativeML OpenRAIL-M</td><td><a href="https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 2.0</td><td>Nov 2022</td><td>U-Net 865M</td><td>CreativeML OpenRAIL++-M</td><td><a href="https://huggingface.co/sd2-community/stable-diffusion-2" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 2.1</td><td>Dec 2022</td><td>U-Net 865M</td><td>CreativeML OpenRAIL++-M</td><td><a href="https://huggingface.co/sd2-community/stable-diffusion-2-1" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SDXL 1.0</td><td>Jul 2023</td><td>U-Net 2.6B</td><td>CreativeML OpenRAIL++-M</td><td><a href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SDXL Turbo</td><td>Nov 2023</td><td>U-Net 2.6B · 1–4 steps</td><td><b>Non-commercial only</b></td><td><a href="https://huggingface.co/stabilityai/sdxl-turbo" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 3 Medium</td><td>Jun 2024</td><td>MMDiT 2B</td><td>Stability Community</td><td><a href="https://huggingface.co/stabilityai/stable-diffusion-3-medium" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 3.5 Large</td><td>Oct 2024</td><td>MMDiT 8B</td><td>Stability Community</td><td><a href="https://huggingface.co/stabilityai/stable-diffusion-3.5-large" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 3.5 Large Turbo</td><td>Oct 2024</td><td>MMDiT 8B · 4 steps</td><td>Stability Community</td><td><a href="https://huggingface.co/stabilityai/stable-diffusion-3.5-large-turbo" target="_blank" rel="noopener">weights</a></td></tr>
<tr><td>SD 3.5 Medium</td><td>Oct 2024</td><td>MMDiT-X 2.5B</td><td>Stability Community</td><td><a href="https://huggingface.co/stabilityai/stable-diffusion-3.5-medium" target="_blank" rel="noopener">weights</a></td></tr>
</tbody>
</table>
</div>

<p class="sd-note"><strong>A note on how this was written.</strong> I put this
post together in collaboration with AI agents — drafting the explanations,
building the diagrams, checking the arithmetic behind the schedule, and running
down every licence and link in the table above. Using AI to work out how AI
works turned out to be a genuinely good way to learn it: every hand-wave I tried
to get away with had to be turned into something that actually rendered, or
actually summed to 100%. The mistakes that survived are mine.</p>

<script>
(function () {
  /* The version switcher sits further down the page, so this inline script
     cannot touch it at parse time. Everything waits for DOM ready. */
  function boot() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- Shared picture + noise ---------------- */
    /* The target picture — the prompt in the first diagram, drawn by hand once
       to an offscreen canvas. Everything below only needs pixels to read. */
    function paintTarget(c, N, variant) {
      var u = function (v) { return v * N; };
      function ell(cx, cy, rx, ry, rot, fill) {
        c.beginPath();
        c.ellipse(u(cx), u(cy), u(rx), u(ry), rot, 0, Math.PI * 2);
        c.fillStyle = fill; c.fill();
      }
      /* `variant` is the same drawing in another palette — it stands in for
         "the model came back with something different". */
      var P = variant
        ? { sky1: '#e8eef8', sky2: '#c3cfe4', table: '#8b93a3', ear: '#5b6473', head: '#8b95a6', muzzle: '#e6ebf3', coffee: '#b9a184' }
        : { sky1: '#f8ecda', sky2: '#e2c6a2', table: '#c1905f', ear: '#9d6436', head: '#cb8b53', muzzle: '#f2ddc4', coffee: '#d9a86e' };
      var bg = c.createLinearGradient(0, 0, 0, N);
      bg.addColorStop(0, P.sky1); bg.addColorStop(1, P.sky2);
      c.fillStyle = bg; c.fillRect(0, 0, N, N);
      c.fillStyle = P.table; c.fillRect(0, u(0.88), N, u(0.12));

      ell(0.27, 0.40, 0.085, 0.165, -0.35, P.ear);       /* ears, behind */
      ell(0.73, 0.40, 0.085, 0.165, 0.35, P.ear);
      ell(0.50, 0.40, 0.235, 0.215, 0, P.head);          /* head */
      ell(0.50, 0.505, 0.125, 0.088, 0, P.muzzle);       /* muzzle */
      ell(0.415, 0.383, 0.027, 0.031, 0, '#33241c');     /* eyes */
      ell(0.585, 0.383, 0.027, 0.031, 0, '#33241c');
      ell(0.424, 0.374, 0.009, 0.010, 0, '#ffffff');
      ell(0.594, 0.374, 0.009, 0.010, 0, '#ffffff');
      ell(0.50, 0.470, 0.033, 0.025, 0, '#3a2820');      /* nose */
      c.strokeStyle = '#8a5c34'; c.lineWidth = Math.max(1, u(0.009)); c.lineCap = 'round';
      c.beginPath();
      c.moveTo(u(0.50), u(0.495));
      c.quadraticCurveTo(u(0.464), u(0.536), u(0.442), u(0.506));
      c.moveTo(u(0.50), u(0.495));
      c.quadraticCurveTo(u(0.536), u(0.536), u(0.558), u(0.506));
      c.stroke();

      c.beginPath();                                      /* cup */
      c.moveTo(u(0.335), u(0.700)); c.lineTo(u(0.665), u(0.700));
      c.lineTo(u(0.615), u(0.885)); c.lineTo(u(0.385), u(0.885));
      c.closePath(); c.fillStyle = '#fbfaf8'; c.fill();
      c.strokeStyle = '#fbfaf8'; c.lineWidth = u(0.030);
      c.beginPath(); c.arc(u(0.668), u(0.762), u(0.056), -1.15, 1.15); c.stroke();
      ell(0.50, 0.700, 0.166, 0.046, 0, P.coffee);        /* coffee */
      ell(0.50, 0.694, 0.112, 0.030, 0, '#f6ead6');       /* foam */

      c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = u(0.015);
      [[0.30, -1], [0.70, 1]].forEach(function (t) {      /* steam, clear of the head */
        c.beginPath();
        c.moveTo(u(t[0]), u(0.660));
        c.quadraticCurveTo(u(t[0] + 0.032 * t[1]), u(0.622), u(t[0]), u(0.585));
        c.quadraticCurveTo(u(t[0] - 0.032 * t[1]), u(0.552), u(t[0]), u(0.515));
        c.stroke();
      });
    }
    var SRC = 256;
    function bake(variant) {
      var cv = document.createElement('canvas');
      cv.width = cv.height = SRC;
      var cx = cv.getContext('2d');
      paintTarget(cx, SRC, variant);
      return cx.getImageData(0, 0, SRC, SRC).data;
    }
    var SRCPX = bake(false), ALTPX = bake(true);
    function sample(px, x, y) {
      var ix = Math.min(SRC - 1, Math.max(0, (x * SRC) | 0));
      var iy = Math.min(SRC - 1, Math.max(0, (y * SRC) | 0));
      var o = (iy * SRC + ix) * 4;
      return [px[o] / 255, px[o + 1] / 255, px[o + 2] / 255];
    }
    function scene(x, y) { return sample(SRCPX, x, y); }

    /* the 64x64 stand-in for the picture, plus one fixed noise field */
    var S = 64;
    var target = new Float32Array(S * S * 3);
    for (var ty = 0; ty < S; ty++) {
      for (var tx = 0; tx < S; tx++) {
        var tc = scene((tx + 0.5) / S, (ty + 0.5) / S), to = (ty * S + tx) * 3;
        target[to]     = (tc[1] - 0.45) * 1.5 + 0.5;
        target[to + 1] = (tc[2] - 0.45) * 1.5 + 0.5;
        target[to + 2] = (tc[0] - 0.45) * 1.5 + 0.5;
      }
    }
    var eps = new Float32Array(S * S * 3);
    for (var ei = 0; ei < eps.length; ei += 3) {
      var g1 = Math.random() || 1e-9, g2 = Math.random();
      var gn = Math.sqrt(-2 * Math.log(g1)) * Math.cos(2 * Math.PI * g2) * 0.32;
      eps[ei] = gn;
      eps[ei + 1] = gn * 0.72 + (Math.random() - 0.5) * 0.22;
      eps[ei + 2] = gn * 0.55 + (Math.random() - 0.5) * 0.26;
    }

    var T = 1000;
    /* cosine schedule (Nichol & Dhariwal 2021), s = 0.008 */
    function alphaBar(t) {
      var s = 0.008, f = function (x) { return Math.pow(Math.cos(((x / T + s) / (1 + s)) * Math.PI / 2), 2); };
      return f(t) / f(0);
    }
    /* the sketch is not a small picture: rotate channels so it reads as one */

    /* ---------------- Diagram 1: pipeline ---------------- */
    var root = document.getElementById('sd-pipe');
    if (root) {
      var packets = [
        { g: document.getElementById('packet'), dots: ['pk0','pk1','pk2'].map(function (i) { return document.getElementById(i); }) },
        { g: document.getElementById('packet-b'), dots: ['pb0','pb1','pb2'].map(function (i) { return document.getElementById(i); }) }
      ];
      var statusEl = document.getElementById('pipe-status');
      var playBtn = document.getElementById('pipe-play');
      var resetBtn = document.getElementById('pipe-reset');
      var loopbox = document.getElementById('loopbox');
      var loopfill = document.getElementById('loopfill');
      var loopbadge = document.getElementById('loopbadgebg');
      var STEPS = 10;

      /* the sketch, as a strip of cells that settle from noise into structure */
      var cellsG = document.getElementById('latent-cells');
      var COLS = 16, ROWS = 4, CELL = 10, cells = [];
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          el.setAttribute('x', c * CELL); el.setAttribute('y', r * CELL);
          el.setAttribute('width', CELL - 1.6); el.setAttribute('height', CELL - 1.6);
          el.setAttribute('rx', 2);
          cellsG.appendChild(el); cells.push(el);
        }
      }
      /* Fixed target so the strip resolves the same way every run. Named
         `cellTarget`, not `target`: `var` is function-scoped, and a plain
         `target` here would clobber the shared latent buffer above. */
      var cellTarget = cells.map(function (_, i) {
        var c = i % COLS, r = (i / COLS) | 0;
        return 0.25 + 0.6 * Math.abs(Math.sin(c * 0.55 + r * 0.9));
      });
      var cellSeed = cells.map(function () { return Math.random(); });
      function paintCells(clean) {
        for (var i = 0; i < cells.length; i++) {
          var v = cellSeed[i] * (1 - clean) + cellTarget[i] * clean;
          cells[i].setAttribute('fill', 'var(--accent)');
          cells[i].setAttribute('opacity', (0.1 + 0.7 * v).toFixed(3));
        }
      }
      paintCells(0);

      var seg = function (id) { return document.getElementById(id); };
      var node = function (id) { return document.getElementById(id); };
      function lightOnly(ids) {
        ['n-prompt','n-clip','n-embed','n-noise','n-unet','n-sched','n-vae','n-img'].forEach(function (id) {
          node(id).classList.toggle('on', ids.indexOf(id) !== -1);
        });
      }
      function loopOn(on) {
        loopbox.classList.toggle('on', on);
        loopfill.classList.toggle('on', on);
        loopbadge.classList.toggle('on', on);
      }

      var TL = [
        { path: 'w-p2e', ms: 620, on: ['n-prompt'], label: 'Reading the prompt' },
        { path: 'w-e2m', ms: 620, on: ['n-clip'],   label: 'Words become numbers' },
        { path: ['w-m2u', 'w-n2u'], ms: 900, on: ['n-embed', 'n-noise'],
          label: 'Static and meaning reach the U-Net together' },
        { loop: true,               label: 'Denoising' },
        { path: 'w-s2v', ms: 760, on: ['n-sched'],  label: 'The finished sketch leaves the loop' },
        { path: 'w-v2i', ms: 620, on: ['n-vae'],    label: 'Decoding to 512 × 512 pixels' },
        { done: true,               label: 'Done' }
      ];

      var idx = 0, step = 0, playing = false, raf = 0, t0 = 0, phase = 0;

      /* Several wires can be live at once — the meaning and the static reach the
         U-Net together. Progress is normalised per path, so packets on wires of
         different lengths still arrive at the same moment. */
      function setPacket(pathIds, u) {
        if (typeof pathIds === 'string') pathIds = [pathIds];
        packets.forEach(function (pk, i) {
          var id = pathIds[i];
          if (!id) { pk.g.setAttribute('opacity', '0'); return; }
          pk.g.setAttribute('opacity', '1');
          var p = seg(id), L = p.getTotalLength();
          pk.dots.forEach(function (c, j) {
            var pt = p.getPointAtLength(L * Math.max(0, u - j * 0.06));
            c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
          });
        });
      }
      function hidePackets() {
        packets.forEach(function (pk) { pk.g.setAttribute('opacity', '0'); });
      }
      function status(txt) { statusEl.innerHTML = txt; }
      function reset() {
        cancelAnimationFrame(raf); playing = false; idx = 0; step = 0; phase = 0;
        hidePackets(); lightOnly([]); loopOn(false);
        document.getElementById('loopcount').textContent = '× ' + STEPS + ' STEPS';
        paintCells(0); playBtn.setAttribute('aria-pressed', 'false');
        playBtn.textContent = '▶ Play'; status('Ready');
      }
      function finish() {
        playing = false; hidePackets(); lightOnly(['n-img']);
        loopOn(false); paintCells(1);
        playBtn.setAttribute('aria-pressed', 'false'); playBtn.textContent = '▶ Replay';
        status('<b>Done</b> — ' + STEPS + ' steps');
      }
      function frame(ts) {
        if (!playing) return;
        if (!t0) t0 = ts;
        var cur = TL[idx];
        if (cur.done) { finish(); return; }
        if (cur.loop) {
          /* U-Net → scheduler → back, once per step. Each leg is timed from its
             own start so a paused tab resumes instead of rewinding the count. */
          var legMs = 200, u = Math.min(1, (ts - t0) / legMs);
          var forward = phase % 2 === 0;
          step = Math.floor(phase / 2) + 1;
          loopOn(true);
          lightOnly(forward ? ['n-unet'] : ['n-sched']);
          setPacket(forward ? 'w-u2s' : 'w-s2u', u);
          paintCells(Math.min(1, phase / (STEPS * 2 - 1)));
          document.getElementById('loopcount').textContent = 'STEP ' + step + ' / ' + STEPS;
          status('<b>' + (forward ? 'U-Net' : 'Scheduler') + '</b> · step ' + step + ' / ' + STEPS +
                 '<br>' + (forward ? 'guessing the noise' : 'subtracting the guess'));
          if (u >= 1) {
            phase++; t0 = 0;
            if (phase >= STEPS * 2) { idx++; phase = 0; }
          }
          raf = requestAnimationFrame(frame);
          return;
        }
        var prog = Math.min(1, (ts - t0) / cur.ms);
        lightOnly(cur.on || []);
        setPacket(cur.path, prog);
        status(cur.label);
        if (prog >= 1) { idx++; t0 = 0; }
        raf = requestAnimationFrame(frame);
      }
      function play() {
        if (playing) {
          playing = false; cancelAnimationFrame(raf);
          playBtn.setAttribute('aria-pressed', 'false'); playBtn.textContent = '▶ Play';
          return;
        }
        if (idx >= TL.length - 1) reset();
        playing = true; t0 = 0;
        playBtn.setAttribute('aria-pressed', 'true'); playBtn.textContent = '⏸ Pause';
        raf = requestAnimationFrame(frame);
      }
      playBtn.addEventListener('click', play);
      resetBtn.addEventListener('click', reset);
      /* Browsers pause rAF in a background tab. Without this the first frame
         back carries a huge delta and the animation jumps a whole segment. */
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && playing) {
          cancelAnimationFrame(raf); t0 = 0; raf = requestAnimationFrame(frame);
        }
      });
      if (reduce) { finish(); status('Motion reduced — showing the end state'); }
    }

    /* ---------------- Diagram 2: the schedule ---------------- */
    var nz = document.getElementById('sd-noise');
    if (nz) {
      var latC = document.getElementById('nz-latent').getContext('2d');
      var imgC = document.getElementById('nz-image').getContext('2d');
      var range = document.getElementById('nz-range');
      var nzStatus = document.getElementById('nz-status');
      var nzPlay = document.getElementById('nz-play');
      var sigBar = document.getElementById('nz-sig'), noiBar = document.getElementById('nz-noi');
      var sigLab = document.getElementById('nz-siglab'), noiLab = document.getElementById('nz-noilab');

      var latImg = latC.createImageData(S, S);

      function drawLatent(ab) {
        var a = Math.sqrt(ab), b = Math.sqrt(1 - ab), d = latImg.data;
        for (var i = 0, p = 0; i < S * S * 3; i += 3, p += 4) {
          d[p]     = Math.max(0, Math.min(255, (a * target[i]     + b * eps[i]     + 0.5 * (1 - a)) * 255));
          d[p + 1] = Math.max(0, Math.min(255, (a * target[i + 1] + b * eps[i + 1] + 0.5 * (1 - a)) * 255));
          d[p + 2] = Math.max(0, Math.min(255, (a * target[i + 2] + b * eps[i + 2] + 0.5 * (1 - a)) * 255));
          d[p + 3] = 255;
        }
        latC.putImageData(latImg, 0, 0);
      }
      function drawImage(ab) {
        var N = 256, img = imgC.createImageData(N, N), d = img.data, clean = Math.sqrt(ab);
        var blur = (1 - clean) * 26;
        for (var y = 0; y < N; y++) {
          for (var x = 0; x < N; x++) {
            var q = blur > 0.5 ? blur : 0;
            var sx = q ? (Math.floor(x / q) + 0.5) * q / N : (x + 0.5) / N;
            var sy = q ? (Math.floor(y / q) + 0.5) * q / N : (y + 0.5) / N;
            var c3 = scene(Math.min(1, sx), Math.min(1, sy)), p = (y * N + x) * 4;
            var g = (1 - clean) * 0.55;
            d[p]     = Math.max(0, Math.min(255, (c3[0] * clean + 0.5 * g + (Math.random() - 0.5) * g) * 255));
            d[p + 1] = Math.max(0, Math.min(255, (c3[1] * clean + 0.5 * g + (Math.random() - 0.5) * g) * 255));
            d[p + 2] = Math.max(0, Math.min(255, (c3[2] * clean + 0.5 * g + (Math.random() - 0.5) * g) * 255));
            d[p + 3] = 255;
          }
        }
        imgC.putImageData(img, 0, 0);
      }
      function render(t) {
        /* Mixing uses the amplitudes √ᾱ and √(1−ᾱ); the readout uses ᾱ itself,
           which is the share of the *variance* — so the two halves sum to 100%
           instead of looking like a broken percentage. */
        var ab = alphaBar(t);
        drawLatent(ab); drawImage(ab);
        sigBar.style.width = (100 * ab).toFixed(2) + '%';
        noiBar.style.width = (100 * (1 - ab)).toFixed(2) + '%';
        sigLab.textContent = 'picture ' + Math.round(100 * ab) + '%';
        noiLab.textContent = 'noise ' + Math.round(100 * (1 - ab)) + '%';
        nzStatus.textContent = 'step ' + Math.round((T - t) / T * 10) + ' / 10';
      }

      /* The slider is progress: left is the start (pure static), right is the
         finish. Timesteps run the other way, so invert. */
      var tOf = function (v) { return T - v; };

      var anim = 0;
      function stopAnim() {
        cancelAnimationFrame(anim); anim = 0;
        nzPlay.setAttribute('aria-pressed', 'false'); nzPlay.textContent = '▶ Run';
      }
      range.addEventListener('input', function () { stopAnim(); render(tOf(+range.value)); });
      nzPlay.addEventListener('click', function () {
        if (anim) { stopAnim(); return; }
        var v = +range.value >= T ? 0 : +range.value, last = 0;
        nzPlay.setAttribute('aria-pressed', 'true'); nzPlay.textContent = '⏸ Pause';
        (function tick(ts) {
          if (!last) last = ts;
          v += (ts - last) * 0.55; last = ts;
          if (v >= T) { range.value = T; render(0); stopAnim(); return; }
          range.value = v; render(tOf(v));
          anim = requestAnimationFrame(tick);
        })(performance.now());
      });
      render(T);
      if (reduce) { range.value = T; render(0); }
    }

    /* ---------------- Diagram 3: three generations ---------------- */
    var evo = document.getElementById('sd-evo');
    if (evo) {
      /* Encoder figures are the text towers only. Backbone excludes the
         decoder (~50-84M in every version). */
      var V = [
        {
          core: 'U-Net', corep: '860M weights', obj: 'curved schedule',
          enc: [{ n: 'CLIP ViT-L/14', d: '123M · 768 numbers wide' }],
          ctx: 'one reader', lat: '4 channels · 64 × 64', planes: 2,
          bars: { text: 123, core: 860, ctx: 768, ch: 4 },
          cap: 'SD 1.4 and 1.5 · 2022. One text encoder, a U-Net, a 4-channel sketch — everything in the diagrams above.'
        },
        {
          core: 'U-Net', corep: '865M weights', obj: 'curved schedule',
          enc: [{ n: 'OpenCLIP ViT-H/14', d: '354M · 1024 numbers wide' }],
          ctx: 'one bigger reader', lat: '4 channels · 96 × 96', planes: 2,
          bars: { text: 354, core: 865, ctx: 1024, ch: 4 },
          cap: 'SD 2.0 and 2.1 · 2022. A bigger reader bolted to essentially the same U-Net.'
        },
        {
          core: 'U-Net', corep: '2.6B weights', obj: 'curved schedule',
          enc: [
            { n: 'CLIP ViT-L/14', d: '123M · 768 numbers wide' },
            { n: 'OpenCLIP ViT-bigG/14', d: '695M · 1280 numbers wide', hero: true }
          ],
          ctx: 'two readers, glued · 2048 wide', lat: '4 channels · 128 × 128', planes: 2,
          bars: { text: 818, core: 2600, ctx: 2048, ch: 4 },
          cap: 'SDXL 1.0 and SDXL Turbo · 2023. Three times the U-Net and a second reader, but still the same 4-channel sketch and the same curved schedule.'
        },
        {
          core: 'Transformer', corep: '2B – 8B weights · no U-Net', obj: 'straight schedule',
          enc: [
            { n: 'CLIP ViT-L/14', d: '123M' },
            { n: 'OpenCLIP ViT-bigG/14', d: '695M' },
            { n: 'T5-XXL', d: '4.7B · optional, but it is what fixed text in images', hero: true }
          ],
          ctx: 'three readers · 4096 numbers wide', lat: '16 channels · 128 × 128', planes: 4,
          bars: { text: 5578, core: 8000, ctx: 4096, ch: 16 },
          cap: 'SD 3 and 3.5 · 2024. The U-Net is replaced by a transformer that reads sketch and words together, the schedule straightens out, and the sketch finally gets more than four channels.'
        }
      ];
      var MAX = { text: 5578, core: 8000, ctx: 4096, ch: 16 };
      var BARS = [
        { k: 'core', label: 'does the work', fmt: function (v) { return v >= 1000 ? (v / 1000) + 'B' : v + 'M'; } },
        { k: 'text', label: 'reads the words', fmt: function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'B' : v + 'M'; } },
        { k: 'ctx',  label: 'meaning width', fmt: function (v) { return v + ''; } },
        { k: 'ch',   label: 'sketch channels', fmt: function (v) { return v + ''; } }
      ];

      var encWrap = document.getElementById('ev-enc');
      var planesWrap = document.getElementById('ev-planes');
      var barsWrap = document.getElementById('ev-bars');
      var tabs = Array.prototype.slice.call(evo.querySelectorAll('.sde__tabs [data-v]'));

      /* fixed slots so switching animates instead of re-flowing */
      var MAXENC = 3, encEls = [];
      for (var e = 0; e < MAXENC; e++) {
        var box = document.createElement('div');
        box.className = 'sde__enc';
        box.innerHTML = '<b></b><span></span>';
        encWrap.appendChild(box); encEls.push(box);
      }
      var MAXPL = 4, plEls = [];
      for (var q = 0; q < MAXPL; q++) {
        var pl = document.createElement('i');
        planesWrap.appendChild(pl); plEls.push(pl);
      }
      var barEls = BARS.map(function (b) {
        var row = document.createElement('div');
        row.className = 'sde__bar';
        row.innerHTML = '<u>' + b.label + '</u><span class="sde__track"><i class="sde__fill"></i></span><b></b>';
        barsWrap.appendChild(row);
        return { fill: row.querySelector('.sde__fill'), val: row.querySelector('b'), def: b };
      });

      function show(i) {
        var v = V[i];
        tabs.forEach(function (t, j) { t.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        encEls.forEach(function (el, j) {
          var d = v.enc[j];
          if (!d) { el.hidden = true; return; }
          el.hidden = false;
          el.classList.toggle('sde__enc--hero', !!d.hero);
          el.querySelector('b').textContent = d.n;
          el.querySelector('span').textContent = d.d;
        });
        document.getElementById('ev-ctx').textContent = v.ctx;
        document.getElementById('ev-core-name').textContent = v.core;
        document.getElementById('ev-core-p').textContent = v.corep;
        document.getElementById('ev-obj').textContent = v.obj;
        document.getElementById('ev-lat').textContent = v.lat;
        document.getElementById('ev-cap').textContent = v.cap;
        plEls.forEach(function (el, j) {
          var on = j < v.planes;
          el.style.opacity = on ? (0.35 + 0.65 * (j / Math.max(1, v.planes - 1))).toFixed(2) : '0';
          el.style.transform = 'translate(' + (j * 13) + 'px,' + (j * 11) + 'px)';
        });
        barEls.forEach(function (b) {
          var raw = v.bars[b.def.k];
          b.fill.style.width = (100 * raw / MAX[b.def.k]).toFixed(1) + '%';
          b.val.textContent = b.def.fmt(raw);
        });
      }
      tabs.forEach(function (t) {
        t.addEventListener('click', function () { show(+t.dataset.v); });
      });
      show(0);
    }

    /* ---------------- image to image: the strength dial ---------------- */
    var i2 = document.getElementById('sd-i2i');
    if (i2) {
      var inC = document.getElementById('i2-in').getContext('2d');
      var midC = document.getElementById('i2-mid').getContext('2d');
      var outC = document.getElementById('i2-out').getContext('2d');
      var i2r = document.getElementById('i2-range');
      var i2s = document.getElementById('i2-status');
      var i2cap = document.getElementById('i2-cap');
      var STEPS_I2 = 10;

      /* the input, drawn once — it never changes */
      (function () {
        var img = inC.createImageData(256, 256), d = img.data;
        for (var y = 0; y < 256; y++) {
          for (var x = 0; x < 256; x++) {
            var c = sample(SRCPX, (x + 0.5) / 256, (y + 0.5) / 256), o = (y * 256 + x) * 4;
            d[o] = c[0] * 255; d[o + 1] = c[1] * 255; d[o + 2] = c[2] * 255; d[o + 3] = 255;
          }
        }
        inC.putImageData(img, 0, 0);
      })();

      var midImg = midC.createImageData(S, S);
      function drawStart(str) {
        /* noise the sketch up to t = strength x T, exactly as img2img does */
        var ab = alphaBar(str * T), a = Math.sqrt(ab), b = Math.sqrt(1 - ab), d = midImg.data;
        for (var i = 0, q = 0; i < S * S * 3; i += 3, q += 4) {
          d[q]     = Math.max(0, Math.min(255, (a * target[i]     + b * eps[i]     + 0.5 * (1 - a)) * 255));
          d[q + 1] = Math.max(0, Math.min(255, (a * target[i + 1] + b * eps[i + 1] + 0.5 * (1 - a)) * 255));
          d[q + 2] = Math.max(0, Math.min(255, (a * target[i + 2] + b * eps[i + 2] + 0.5 * (1 - a)) * 255));
          d[q + 3] = 255;
        }
        midC.putImageData(midImg, 0, 0);
      }
      function drawOut(str) {
        /* Illustration: the more of the input we noised away, the more the run is
           free to land somewhere else. Blend towards the variant palette. */
        var N = 256, img = outC.createImageData(N, N), d = img.data;
        var drift = Math.pow(str, 1.4);
        for (var y = 0; y < N; y++) {
          for (var x = 0; x < N; x++) {
            var u = (x + 0.5) / N, v = (y + 0.5) / N;
            var A = sample(SRCPX, u, v), B = sample(ALTPX, u, v), o = (y * N + x) * 4;
            d[o]     = (A[0] * (1 - drift) + B[0] * drift) * 255;
            d[o + 1] = (A[1] * (1 - drift) + B[1] * drift) * 255;
            d[o + 2] = (A[2] * (1 - drift) + B[2] * drift) * 255;
            d[o + 3] = 255;
          }
        }
        outC.putImageData(img, 0, 0);
      }
      function renderI2() {
        var str = +i2r.value / 100;
        var steps = Math.round(str * STEPS_I2);
        drawStart(str); drawOut(str);
        document.getElementById('i2-in').classList.toggle('sdv-canvas--muted', str >= 0.995);
        i2s.innerHTML = '<b>' + str.toFixed(2) + '</b> · ' + steps + ' of ' + STEPS_I2 + ' steps';
        i2cap.textContent = str >= 0.995
          ? 'Strength 1: the input has been noised into nothing and plays no part. This is text-to-image.'
          : (str <= 0.005
            ? 'Strength 0: nothing is added and nothing is run. You get your own picture back.'
            : 'The middle panel is where denoising begins — your picture, ' + Math.round(100 * (1 - alphaBar(str * T))) +
              '% noise. Only ' + steps + ' of the ' + STEPS_I2 + ' steps still need to run. (The right panel is an illustration, not a real model run.)');
      }
      i2r.addEventListener('input', renderI2);
      renderI2();
    }

    /* ---------------- The two schedules, plotted ---------------- */
    var paths = document.getElementById('sd-paths');
    if (paths) {
      var X0 = 44, X1 = 396, Y0 = 150, Y1 = 22, N = 80;
      function plot(id, fn) {
        var pts = [];
        for (var i = 0; i <= N; i++) {
          var u = i / N;
          pts.push((X0 + (X1 - X0) * u).toFixed(1) + ',' + (Y0 + (Y1 - Y0) * fn(u)).toFixed(1));
        }
        document.getElementById(id).setAttribute('points', pts.join(' '));
      }
      /* same cosine schedule as the slider above */
      plot('path-cos', function (u) {
        var s = 0.008, f = function (x) { return Math.pow(Math.cos(((x + s) / (1 + s)) * Math.PI / 2), 2); };
        return Math.sqrt(f(u) / f(0));
      });
      /* rectified flow: a straight line between picture and noise */
      plot('path-rf', function (u) { return 1 - u; });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>
