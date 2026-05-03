export type BlogTranslationLocale = 'en' | 'th';

export type BlogTranslationPostLike = {
  id: string;
  data: {
    slug: string;
    lang: BlogTranslationLocale;
    translationId?: string | undefined;
  };
};

export type BlogTranslationGroups<T extends BlogTranslationPostLike> = Record<string, T[]>;

export function getBlogTranslationKey(post: BlogTranslationPostLike) {
  return post.data.translationId || post.data.slug;
}

export function groupBlogPostsByTranslation<T extends BlogTranslationPostLike>(
  posts: readonly T[]
): BlogTranslationGroups<T> {
  return posts.reduce<BlogTranslationGroups<T>>((acc, post) => {
    const key = getBlogTranslationKey(post);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(post);
    return acc;
  }, {});
}

export function getBlogPostsForLocale<T extends BlogTranslationPostLike>(
  groups: BlogTranslationGroups<T>,
  locale: BlogTranslationLocale
) {
  return Object.values(groups)
    .map(group => group.find(post => post.data.lang === locale))
    .filter((post): post is T => Boolean(post));
}

export function getPreferredBlogPosts<T extends BlogTranslationPostLike>(
  groups: BlogTranslationGroups<T>,
  preferredLocale: BlogTranslationLocale
) {
  return Object.values(groups)
    .map(group => {
      const preferredPost = group.find(post => post.data.lang === preferredLocale);
      return preferredPost ?? group[0];
    })
    .filter((post): post is T => Boolean(post));
}

export function getAlternateBlogPost<T extends BlogTranslationPostLike>(
  post: T,
  groups: BlogTranslationGroups<T>
) {
  const group = groups[getBlogTranslationKey(post)];
  if (!group) return undefined;
  return group.find(candidate => candidate.data.lang !== post.data.lang);
}

export function getBlogPostPath(post: Pick<BlogTranslationPostLike, 'data'>) {
  return post.data.lang === 'th' ? `/th/blog/${post.data.slug}/` : `/blog/${post.data.slug}/`;
}
