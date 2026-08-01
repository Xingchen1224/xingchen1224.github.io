// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://xingchen1224.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // A dark theme that fits the site's futuristic palette. Code blocks are
      // styled to sit on the site's own surfaces via global.css.
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
