import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All blog posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const FORMATS = {
  short: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  long: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
};

export function formatDate(date: Date, style: keyof typeof FORMATS = 'short'): string {
  return FORMATS[style].format(date);
}

/**
 * URL slug for a post. Filenames keep their `YYYY-MM-DD-` prefix for ordering
 * on disk, but the prefix is stripped from the URL — otherwise a post whose
 * front-matter date differs from its filename shows two contradictory dates.
 */
export function postSlug(post: Post): string {
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

export function postUrl(post: Post): string {
  return `/posts/${postSlug(post)}/`;
}
