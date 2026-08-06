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
  github: 'https://github.com/Xingchen1224',
  linkedin: 'https://www.linkedin.com/in/xingchen-wang',
} as const;

export const NAV = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts/' },
  { title: 'CV', href: '/cv/' },
  { title: 'About', href: '/about/' },
] as const;
