export const SITE = {
  title: 'Xingchen Wang',
  name: 'Xingchen Wang',
  description: 'Image Algorithms R&D / Technical Project Leader',
  url: 'https://xingchen1224.github.io',
  locale: 'en-US',
  // Social preview card. Kept in `public/` (not `src/assets/`) so the URL is
  // stable across builds — crawlers cache it, a content hash would not do.
  ogImage: '/assets/images/og-default.png',
  ogImageSize: { width: 1200, height: 630 },
  author: {
    name: 'Xingchen Wang',
    bio: 'Image Algorithms R&D / Technical Project Leader',
  },
} as const;

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/xingchen-wang',
} as const;

export const NAV = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts/' },
  { title: 'CV', href: '/cv/' },
] as const;

/**
 * Accent swatches shown in the header. The `hex` is only the dot the user
 * clicks — the palette each one selects lives in `[data-accent]` in global.css.
 */
export const ACCENTS = [
  { id: 'cyan', name: 'Cyan', hex: '#22d3ee' },
  { id: 'blue', name: 'Blue', hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'violet', name: 'Violet', hex: '#7c3aed' },
  { id: 'amber', name: 'Amber', hex: '#d97706' },
  { id: 'rose', name: 'Rose', hex: '#e11d48' },
] as const;
