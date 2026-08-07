// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://xingchen1224.github.io',
  integrations: [sitemap()],
  // /about/ was folded into /cv/; keep inbound links and search results working.
  // One entry only: listing '/about' and '/about/' collides in the router.
  redirects: { '/about': '/cv/' },
  markdown: {
    shikiConfig: {
      // A dark theme that fits the site's futuristic palette. Code blocks are
      // styled to sit on the site's own surfaces via global.css.
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
