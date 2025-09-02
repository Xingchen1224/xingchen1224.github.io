# Professional Portfolio Configuration Guide

This repository contains the configuration snippets and examples for transforming a Jekyll blog with Minimal Mistakes theme into a professional developer portfolio.

## Quick Setup

### 1. Enable Analytics (Optional)

To enable Plausible analytics, update `_config.yml`:

```yaml
analytics:
  provider: false
  plausible:
    domain: "yourdomain.com"
```

### 2. Enable Comments (Optional)

To enable Giscus comments, update `_config.yml`:

```yaml
comments:
  provider: "giscus"
  giscus:
    repo_id: "your-repo-id"
    category_name: "General"
    category_id: "your-category-id"
    discussion_term: "pathname"
    reactions_enabled: "1"
    theme: "light"
```

Get your Giscus configuration at: https://giscus.app

### 3. Add Social Preview Images

Create these images in `/assets/images/`:
- `social-preview.jpg` (1200x630px) - Default Open Graph image
- `teaser-default.jpg` (500x300px) - Default teaser image  
- `logo.png` - Site logo for masthead

### 4. Customize Colors

Edit `_includes/head/custom.html` to adjust the color scheme:

```css
.masthead {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

.btn--primary {
  background-color: #your-brand-color;
}
```

## Features Included

### ✅ Enhanced Configuration
- SEO optimization with jekyll-seo-tag
- Sitemap generation
- RSS feed
- Site search with Lunr
- Pagination (10 posts per page)
- Open Graph meta tags

### ✅ Professional Post Templates
- Table of contents
- Reading time estimation
- Last modified date
- Social share buttons
- Related posts
- Author profile

### ✅ Projects Collection
- Dedicated projects showcase
- Grid layout with hover effects
- Project categories and filtering
- Individual project pages with galleries

### ✅ Professional Pages
- Enhanced About page
- Comprehensive CV/Resume page
- Projects index with navigation

### ✅ Optional Integrations
- Giscus comments (configure with your repo)
- Plausible analytics (privacy-focused)
- Custom CSS for professional styling

## File Structure

```
├── _config.yml              # Main configuration with all enhancements
├── _data/
│   └── navigation.yml       # Navigation with Projects and CV links
├── _includes/
│   ├── head/
│   │   └── custom.html      # Custom CSS and analytics
│   └── seo.html            # Open Graph and social meta tags
├── _pages/
│   ├── about.md            # Professional about page
│   ├── cv.md               # Comprehensive resume/CV
│   └── projects.md         # Projects collection index
├── _projects/
│   └── my-project.md       # Example project with gallery
└── _posts/
    └── 2024-01-15-scalable-react-applications.md  # Enhanced post example
```

## Configuration Snippets

### Analytics Integration (Plausible)

Add to `_includes/head/custom.html`:
```html
{% if site.analytics.plausible.domain %}
  <script defer data-domain="{{ site.analytics.plausible.domain }}" src="https://plausible.io/js/plausible.js"></script>
{% endif %}
```

### Comments Integration (Giscus)

The theme handles Giscus automatically when configured in `_config.yml`. No additional code needed.

### Social Media Cards

The custom SEO include automatically generates:
- Open Graph tags for Facebook/LinkedIn
- Twitter Card meta tags
- Article metadata for blog posts
- Canonical URLs

## Customization Tips

1. **Brand Colors**: Update the CSS variables in `_includes/head/custom.html`
2. **Images**: Replace placeholder image paths with your actual images
3. **Content**: Customize the about page, CV, and project examples
4. **Navigation**: Adjust `_data/navigation.yml` for your needs
5. **Social Links**: Update author links in `_config.yml`

## Performance Optimizations

The configuration includes several performance enhancements:
- Image optimization settings
- HTML compression
- CSS and JS minification
- Proper caching headers
- Lazy loading for images

## SEO Best Practices

- Structured data markup
- Semantic HTML elements
- Proper heading hierarchy
- Meta descriptions for all pages
- Sitemap and robots.txt
- Fast loading speeds

---

*This configuration transforms a basic Jekyll blog into a professional portfolio suitable for senior developers, technical leads, and engineering managers.*