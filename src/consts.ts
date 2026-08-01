export const SITE = {
  title: 'Xingchen Wang',
  name: 'Xingchen Wang',
  description: 'Image Algorithms R&D / Technical Project Leader',
  url: 'https://xingchen1224.github.io',
  locale: 'en-US',
  author: {
    name: 'Xingchen Wang',
    avatar: '/assets/images/bio-photo.jpg',
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
