# xingchen1224.github.io

Personal website of **Xingchen Wang** — Image Algorithms R&D / Technical Project Leader.
Built with [Astro](https://astro.build) featuring a futuristic glass + neon design, a
light/dark theme toggle, a six-colour accent picker, and scroll-reveal animations.

## Tech stack

- **[Astro](https://astro.build)** — static site generator
- **Content collections** — Markdown blog posts in `src/content/blog`
- **@astrojs/sitemap** + RSS feed (`/rss.xml`)
- No UI framework — plain CSS with design tokens, and small vanilla-TS enhancements
- No third-party CDNs at runtime — fonts (`@fontsource-variable`) and icons
  (inline SVG) are self-hosted, so the page depends on no external host

## Project structure

```
public/                 Static assets (OG image, favicon, robots.txt, .nojekyll)
src/
  assets/               Images processed by astro:assets (avatar)
  components/           Header, Footer, Icon
  content/blog/         Blog posts (Markdown)
  layouts/              BaseLayout, page shell + SEO + JSON-LD
  lib/                  posts.ts (sorting, slugs, dates), icons.ts (SVG paths)
  pages/                Routes: index, about, cv, posts/, 404, rss.xml
  scripts/              Theme switcher, scroll-reveal, mobile nav
  styles/global.css     Design tokens + component styles
  consts.ts             Site metadata, social links, navigation
  content.config.ts     Blog collection schema
astro.config.mjs
```

## Commands

All commands are run from the repository root:

| Command           | Action                                        |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the local dev server at `localhost:4321`|
| `npm run check`   | Type-check `.astro` / `.ts` (also runs in CI) |
| `npm run build`   | Build the production site to `./dist`         |
| `npm run preview` | Preview the production build locally          |

## Writing a post

Add a Markdown file to `src/content/blog/`. Front matter:

```yaml
---
title: "My Post Title"
date: 2026-01-01
excerpt: "A short summary shown in listings and meta tags."
categories: [blog]
tags: [example]
wide: false            # optional: use a wider content column
---
```

Name the file `YYYY-MM-DD-some-slug.md`. The date prefix orders files on disk;
the URL drops it, so the post above lives at `/posts/some-slug/`.

## Deployment

The site deploys automatically to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `master`.
In the repository settings, set **Settings → Pages → Build and deployment → Source**
to **GitHub Actions**.
