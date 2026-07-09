# xingchen1224.github.io

Personal portfolio and technical blog for [Xingchen Wang](https://xingchen1224.github.io) — Image Algorithms R&D / Technical Project Leader.

Built with [Jekyll](https://jekyllrb.com/) and the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) remote theme, hosted on [GitHub Pages](https://pages.github.com/).

---

## Site Structure

| Path | Purpose |
|------|---------|
| `index.html` | Landing page (splash layout with hero + feature rows) |
| `_pages/about.md` | Professional profile and background |
| `_pages/cv.md` | Resume / CV page |
| `_pages/projects.md` | Selected projects showcase |
| `_posts/` | Technical blog posts |
| `_config.yml` | Jekyll site configuration |
| `_data/navigation.yml` | Top navigation links |
| `_includes/head/custom.html` | Custom CSS and optional analytics hooks |
| `assets/images/` | Images (bio photo, etc.) |

---

## Running Locally

### Prerequisites

- Ruby ≥ 3.1 and Bundler (`gem install bundler`)
- Or use the provided `Dockerfile`

### With Bundler

```bash
git clone https://github.com/Xingchen1224/xingchen1224.github.io.git
cd xingchen1224.github.io
bundle install
bundle exec jekyll serve --livereload
```

Open `http://localhost:4000` in your browser.

### With Docker

```bash
docker build -t portfolio .
docker run -p 4000:4000 portfolio
```

---

## Customising the Site

### Personal Details
Edit `_config.yml` — update `name`, `description`, `url`, `author`, and social links.

### Pages
- **About** — `_pages/about.md`
- **CV** — `_pages/cv.md` (sections marked with ✏️ are placeholders)
- **Projects** — `_pages/projects.md` (starter entries — replace with your own)

### Blog Posts
Add Markdown files to `_posts/` following the naming convention `YYYY-MM-DD-title.md`.

### Navigation
Edit `_data/navigation.yml` to add, remove, or reorder navigation links.

### Styling
Custom CSS lives in `_includes/head/custom.html`. The site uses the Minimal Mistakes
`default` skin — other skins (`dark`, `mint`, `air`, etc.) can be set via
`minimal_mistakes_skin` in `_config.yml`.

### Images
Place images in `assets/images/`. Update `author.avatar` in `_config.yml` to point to
your bio photo. The commented-out `teaser`, `logo`, and `og_image` options in
`_config.yml` can be re-enabled once the corresponding image files are added.

---

## Deployment

The site deploys automatically to GitHub Pages on every push to the `master` branch.
No additional CI configuration is needed — GitHub Pages detects the Jekyll source and
builds it with the `github-pages` gem.

---

## Setup Guide

`PORTFOLIO_SETUP.md` in the repository root contains detailed notes on optional
features: analytics, comments (Giscus), social preview images, and colour customisation.

---

## License

Site content © Xingchen Wang. Theme by [Michael Rose](https://github.com/mmistakes)
([MIT License](https://github.com/mmistakes/minimal-mistakes/blob/master/LICENSE)).
