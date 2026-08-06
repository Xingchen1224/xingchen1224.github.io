import rss from '@astrojs/rss';
import { getSortedPosts, postUrl } from '../lib/posts';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    customData: `<language>${SITE.locale.toLowerCase()}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      categories: post.data.categories,
      link: postUrl(post),
    })),
  });
}
