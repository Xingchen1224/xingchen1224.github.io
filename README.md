# Xingchen Wang's Personal Website

This is a personal website built with [Pelican](https://getpelican.com/), a static site generator written in Python.

## Features

- Personal blog posts
- About page
- Archive pages for posts grouped by year, category, and tag
- Clean, minimal design
- Fast static site generation

## Development

### Prerequisites

- Python 3.9+
- pip

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Generate the site:
```bash
make html
```

3. Serve locally for development:
```bash
make devserver
```

The site will be available at http://localhost:8000

### Docker Development

Alternatively, you can use Docker:

```bash
docker build -t pelican-blog .
./run.sh
```

### Publishing

To publish to GitHub Pages:

```bash
make github
```

## Content Structure

- `content/blog/` - Blog posts in Markdown format
- `content/pages/` - Static pages (About, etc.)
- `pelicanconf.py` - Development configuration
- `publishconf.py` - Production configuration

## Adding Content

### New Blog Post

Create a new Markdown file in `content/blog/` with metadata:

```markdown
Title: Your Post Title
Date: 2025-01-01 12:00
Category: blog
Tags: tag1, tag2
Slug: your-post-slug

Your content here...
```

### New Page

Create a new Markdown file in `content/pages/` with metadata:

```markdown
Title: Page Title
Slug: page-slug

Your page content here...
```
