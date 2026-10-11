---
title: "Two AIs Draw Me"
date: 2026-09-15
excerpt: "One prompt, written by the AI agent I work with. Two images, from ChatGPT and Gemini."
wide: true
categories:
  - blog
tags:
  - AI
  - image-generation
---

I asked the AI coding agent I work with every day to describe how it pictures
me, as a prompt for an image model. It refused to invent a face, so the figure
is seen from behind. Everything else in the prompt is real work we did together.

I pasted the prompt, unchanged, into ChatGPT and Gemini.

<style>
.mp-prompt summary{cursor:pointer;color:var(--ink-faint);font-size:0.9rem;}
.mp-prompt pre{white-space:pre-wrap;margin-top:0.6rem;}
.mp figure{margin:2em 0;}
.mp img{display:block;width:100%;height:auto;}
.mp figcaption{margin-top:0.6rem;font-size:0.88rem;color:var(--ink-faint);}
.mp table{font-size:0.94rem;}
</style>

<details class="mp-prompt"><summary>Prompt</summary>

```text
A cinematic wide-angle digital illustration of an image-algorithms engineer and
technical lead working late at night, seen from behind at a sleek desk, so the
face is not visible. The person wears a dark hoodie and over-ear headphones with
a violet accent, rim-lit by cyan and violet neon light. Three glass-like
monitors curve around the desk. Left monitor: a dark live monitoring dashboard
with four glowing line charts in cyan, violet, green and amber, a GPU
utilization bar near 100%. Center monitor: a before/after face-restoration
comparison, the left half blurry with ringing artifacts, the right half sharp
and clean with a green "aligned" checkmark. Right monitor: a black terminal
showing a CI pipeline where build, benchmark and verify stages are green and a
deploy step is running. On the wall, a translucent glass whiteboard with a
hand-drawn architecture sketch: three boxes labeled proxy, framework and engine
connected by arrows, and a dashed CI flow "tag → build → verify → deploy test".
A yellow sticky note reads "Heading home. Keep working after verify. Fix your
own mistakes. I'll check in the morning." To the right, a small server rack with
five glowing units: several Linux servers with blinking green status LEDs and a
Mac mini, one unit marked "2× GPU". On the desk: a mechanical keyboard with a
cyan underglow, an iPhone showing a long stitched screenshot, a steaming coffee
mug, and a compact camera. Futuristic glassmorphism style, dark navy background
with a subtle cyan grid, soft volumetric glow, neon accents in cyan (#22d3ee)
and violet (#7c3aed), clean vector-like shading, high detail, 16:9, 4k.
```

</details>

<div class="mp">

<figure>
<a href="/assets/images/self-portrait/chatgpt-full.png" target="_blank" rel="noopener"><img src="/assets/images/self-portrait/chatgpt.jpg" alt="ChatGPT render: photoreal night office, engineer seen from behind at three monitors." width="1600" height="900" loading="lazy"></a>
<figcaption>ChatGPT. Photoreal. Text is nearly perfect. Added a skyline, slogans, textbooks and dashboard metrics nobody asked for.</figcaption>
</figure>

<figure>
<a href="/assets/images/self-portrait/gemini-full.jpg" target="_blank" rel="noopener"><img src="/assets/images/self-portrait/gemini.jpg" alt="Gemini render: flat vector illustration, engineer seen from behind at three monitors." width="1600" height="893" loading="lazy"></a>
<figcaption>Gemini. Flat vector. Nothing added, nothing missing. Dashboard labels came out garbled.</figcaption>
</figure>

| | ChatGPT | Gemini |
|---|---|---|
| Style | Photoreal | Flat illustration |
| Text | Exact | Mostly exact, small labels garbled |
| Extras | Many | None |

</div>

ChatGPT treats a prompt as a brief to improve on. Gemini builds what you
specified.

## What is in the prompt

Almost none of it is decoration. The agent picked each detail from something we
had actually done.

- **Seen from behind.** It did not know my face and would not invent one.
- **Three monitors.** A live monitoring dashboard, a face-restoration
  before/after, a CI terminal. The three things we spent the most time on.
- **"aligned" checkmark.** A real bug: restored faces came back misaligned.
  We fixed it together.
- **proxy → framework → engine.** The actual shape of our inference service,
  with the internal names removed.
- **tag → build → verify → deploy test.** Our release flow. A git tag kicks it
  off; nothing goes to production without a manual step.
- **The sticky note.** A message I left the agent one evening, word for word.
  It kept working overnight.
- **"2× GPU".** I keep asking it to use both cards. It remembered.
- **Long stitched screenshot.** I send it phone screenshots stitched together
  so it can read a whole chat at once.
- **Compact camera.** From the expo photos elsewhere on this site.
- **Cyan and violet, glass, grid.** This site's default theme.
- **Hoodie and headphones.** Invented. The only guess in the whole prompt.

Neither picture is what I look like. Both are what my work looks like from
inside an AI agent.
