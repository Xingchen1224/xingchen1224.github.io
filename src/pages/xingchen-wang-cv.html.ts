import type { APIRoute } from 'astro';
import { PRINCIPLES, SITE, SOCIAL, emailAddress } from '../consts';
import { CV } from '../lib/cv';

// A self-contained copy of the CV: one file, inline CSS, system fonts, no
// scripts — it opens anywhere and still reads well in ten years.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Character references: invisible to a reader, not a literal address to a scraper.
const entities = (s: string) => [...s].map((c) => `&#${c.codePointAt(0)};`).join('');

const rows = (items: readonly { title: string; body: string; quiet?: boolean }[]) =>
  items
    .map(
      (r) =>
        `<div class="row${r.quiet ? ' quiet' : ''}"><dt>${esc(r.title)}</dt><dd>${esc(r.body)}</dd></div>`,
    )
    .join('');

export const GET: APIRoute = () => {
  const principles = PRINCIPLES.map((p) => ({ title: p.title, body: p.short }));
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE.name)} — CV</title>
<style>
  :root { color-scheme: light dark; --ink:#16181d; --soft:#50545e; --faint:#81858e; --line:#e7e4dd; --bg:#fbfaf7; --accent:#0f766e; }
  @media (prefers-color-scheme: dark) { :root { --ink:#ecebe6; --soft:#a8aca8; --faint:#6f746f; --line:#262b2d; --bg:#0e1113; --accent:#4fd1c0; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  main { max-width: 52rem; margin: 0 auto; padding: 3rem 1.5rem 4rem; }
  h1 { margin: 0; font-size: 2.4rem; letter-spacing: -0.04em; line-height: 1.1; }
  .role { margin: .4rem 0 0; color: var(--soft); }
  .links { margin: .6rem 0 0; font-size: .85rem; color: var(--faint); }
  a { color: var(--accent); text-decoration: none; }
  section { display: grid; grid-template-columns: 9.5rem 1fr; gap: .5rem 1.5rem; padding: 1.75rem 0; border-top: 1px solid var(--line); }
  header { padding-bottom: 1.75rem; }
  h2 { margin: .35rem 0 0; font: 600 .72rem ui-monospace, Menlo, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }
  .lead { margin: 0; font-size: 1.2rem; line-height: 1.5; font-weight: 500; letter-spacing: -.01em; }
  .before { margin: .9rem 0 0; color: var(--soft); font-size: .95rem; }
  .before b { font: 600 .7rem ui-monospace, Menlo, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); margin-right: .6rem; }
  dl { margin: 0; display: grid; gap: 1rem; }
  .row { display: grid; grid-template-columns: 9.5rem 1fr; gap: .2rem 1.5rem; }
  dt { font-weight: 600; font-size: .95rem; }
  dd { margin: 0; color: var(--soft); font-size: .95rem; }
  .quiet dt, .quiet dd { color: var(--faint); font-weight: 500; font-size: .88rem; }
  @media (max-width: 640px) { section, .row { grid-template-columns: 1fr; } }
  @media print { :root { --ink:#111; --soft:#333; --faint:#666; --line:#ccc; --bg:#fff; --accent:#0f766e; } main { padding: 0; } }
</style>
</head>
<body>
<main>
  <header>
    <h1>${esc(SITE.name)}</h1>
    <p class="role">Image Algorithms R&amp;D / Technical Project Leader</p>
    <p class="links"><a href="${SITE.url}">${esc(SITE.url.replace('https://', ''))}</a> · <a href="${SOCIAL.linkedin}">${esc(SOCIAL.linkedin.replace('https://www.', ''))}</a> · <a href="${entities('mailto:' + emailAddress())}">${entities(emailAddress())}</a></p>
  </header>
  <section><h2>Summary</h2><div><p class="lead">${esc(CV.now)}</p><p class="before"><b>Before</b>${esc(CV.before)}</p></div></section>
  <section><h2>Skills</h2><dl>${rows(CV.skills)}</dl></section>
  <section><h2>Philosophies</h2><dl>${rows(principles)}</dl></section>
  <section><h2>Interests</h2><dl>${rows(CV.interests)}</dl></section>
</main>
</body>
</html>
`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
