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

/**
 * Kept in two halves so the address never appears as one string in the page
 * source or the JS bundle — plain `user@host` text is what scrapers look for.
 * Pages join them at runtime; the PDF and HTML exports assemble it themselves.
 */
export const EMAIL = { user: 'xwang95', domain: 'outlook.com' } as const;
export const emailAddress = () => `${EMAIL.user}@${EMAIL.domain}`;

export const NAV = [
  { title: 'Home', href: '/' },
  { title: 'Log', href: '/posts/' },
  { title: 'CV', href: '/cv/' },
] as const;

/** Philosophies — shown short on the home page and in full on the CV. */
export const PRINCIPLES = [
  {
    title: 'A team of AI agents',
    short: 'I steer the direction and checkpoints.',
    long: 'I work every day with a team of AI agents and tools, as partners rather than instruments. Together we get ideas to production quality fast: they bring speed and range, I bring direction and judgement at the checkpoints that matter.',
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
  {
    title: 'First principles',
    short: 'Understand how the world works.',
    long: 'I want to understand the underlying principles of how the world works — which is why I follow data, macroeconomics and company financials.',
  },
] as const;
