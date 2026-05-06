export type BlogTranslationLocale = 'en' | 'th';
export const BLOG_TRANSLATION_LOCALES: BlogTranslationLocale[] = ['en', 'th'];

export type BlogTranslationPostLike = {
  id: string;
  data: {
    slug: string;
    routeSlug?: string | undefined;
    lang: BlogTranslationLocale;
    translationId?: string | undefined;
  };
};

export type BlogTranslationGroups<T extends BlogTranslationPostLike> = Record<string, T[]>;
export type BlogLanguageAvailability<T extends BlogTranslationPostLike> = {
  locale: BlogTranslationLocale;
  post?: T | undefined;
  href?: string | undefined;
  available: boolean;
  isCurrent: boolean;
};

export type BlogPostLanguageState<T extends BlogTranslationPostLike> = {
  key: string;
  current: T;
  preferredLocale: BlogTranslationLocale;
  isFallback: boolean;
  availableLocales: BlogTranslationLocale[];
  availability: Record<BlogTranslationLocale, BlogLanguageAvailability<T>>;
  alternate?: T | undefined;
};

export function getBlogTranslationKey(post: BlogTranslationPostLike) {
  return post.data.translationId ?? post.data.slug;
}

export function groupBlogPostsByTranslation<T extends BlogTranslationPostLike>(
  posts: readonly T[]
): BlogTranslationGroups<T> {
  return posts.reduce<BlogTranslationGroups<T>>((acc, post) => {
    const key = getBlogTranslationKey(post);
    acc[key] ??= [];
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

export function getBlogLanguageName(locale: BlogTranslationLocale) {
  return locale === 'th' ? 'Thai' : 'English';
}

export function getBlogExclusiveLocaleLabel(locale: BlogTranslationLocale) {
  return `${getBlogLanguageName(locale)} only`;
}

function buildBlogLanguageState<T extends BlogTranslationPostLike>(
  group: readonly T[],
  current: T,
  preferredLocale: BlogTranslationLocale
): BlogPostLanguageState<T> {
  const byLocale = group.reduce<Partial<Record<BlogTranslationLocale, T>>>((acc, post) => {
    acc[post.data.lang] = post;
    return acc;
  }, {});

  const availability = BLOG_TRANSLATION_LOCALES.reduce<
    Record<BlogTranslationLocale, BlogLanguageAvailability<T>>
  >(
    (acc, locale) => {
      const post = byLocale[locale];
      acc[locale] = {
        locale,
        post,
        href: post ? getBlogPostPath(post) : undefined,
        available: Boolean(post),
        isCurrent: locale === current.data.lang,
      };
      return acc;
    },
    {} as Record<BlogTranslationLocale, BlogLanguageAvailability<T>>
  );

  return {
    key: getBlogTranslationKey(current),
    current,
    preferredLocale,
    isFallback: current.data.lang !== preferredLocale,
    availableLocales: BLOG_TRANSLATION_LOCALES.filter(locale => Boolean(byLocale[locale])),
    availability,
    alternate: group.find(candidate => candidate.id !== current.id),
  };
}

export function getPreferredBlogPostStates<T extends BlogTranslationPostLike>(
  groups: BlogTranslationGroups<T>,
  preferredLocale: BlogTranslationLocale
) {
  return Object.values(groups)
    .map(group => {
      const current = group.find(post => post.data.lang === preferredLocale) ?? group[0];
      return current ? buildBlogLanguageState(group, current, preferredLocale) : undefined;
    })
    .filter((state): state is BlogPostLanguageState<T> => Boolean(state));
}

export function getBlogPostLanguageState<T extends BlogTranslationPostLike>(
  post: T,
  groups: BlogTranslationGroups<T>
) {
  const group = groups[getBlogTranslationKey(post)] ?? [post];
  return buildBlogLanguageState(group, post, post.data.lang);
}

export function getAlternateBlogPost<T extends BlogTranslationPostLike>(
  post: T,
  groups: BlogTranslationGroups<T>
) {
  const group = groups[getBlogTranslationKey(post)];
  if (!group) return undefined;
  return group.find(candidate => candidate.data.lang !== post.data.lang);
}

export function getBlogPostRouteSlug(post: Pick<BlogTranslationPostLike, 'data'>) {
  return post.data.routeSlug ?? post.data.slug;
}

export function getBlogPostPath(post: Pick<BlogTranslationPostLike, 'data'>) {
  const publicSlug = getBlogPostRouteSlug(post);
  return post.data.lang === 'th' ? `/th/blog/${publicSlug}/` : `/blog/${publicSlug}/`;
}
