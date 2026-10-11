export const SITE = {
  title: 'Xingchen Wang',
  name: 'Xingchen Wang',
  description: 'Image Algorithms R&D / Technical Project Leader — building production software together with AI: clear direction, simple results, designed from the user\'s side.',
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
  { title: 'Writing', href: '/posts/' },
  { title: 'CV', href: '/cv/' },
] as const;

/** How I work — shown short on the home page and in full on the CV. */
export const PRINCIPLES = [
  {
    title: 'Partners with AI',
    short: 'A teammate, not a tool — I steer the direction and key checkpoints.',
    long: 'AI is not a tool I pick up now and then; it is a partner I work with every day. Together we get ideas to production quality fast: it brings speed and range, I bring direction and judgement at the checkpoints that matter.',
  },
  {
    title: 'Minimalism',
    short: 'Take away until only what matters is left.',
    long: 'A taste for restraint. In product, code and writing I keep removing until every remaining piece earns its place.',
  },
  {
    title: 'Empathy',
    short: 'Start from the other person’s seat.',
    long: 'I try to see the work from where the user, the reader or the teammate is standing — and design for that, not for how it looks from the inside.',
  },
] as const;
