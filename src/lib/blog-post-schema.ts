/**
 * Generate JSON-LD schema for blog posts
 */

interface BlogPostSchemaParams {
  title: string;
  excerpt: string;
  pubDate: Date;
  canonicalUrl: string;
  imageUrl: string;
  authorUrl: string;
  authorSameAs: string[];
  siteUrl: string;
  seriesSlug?: string | undefined;
  seriesTitle?: string | undefined;
  seriesOrder?: number | undefined;
}

export function generateBlogPostSchema(params: BlogPostSchemaParams) {
  const {
    title,
    excerpt,
    pubDate,
    canonicalUrl,
    imageUrl,
    authorUrl,
    authorSameAs,
    siteUrl,
    seriesSlug,
    seriesTitle,
    seriesOrder,
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: pubDate.toISOString?.() ?? String(pubDate),
    mainEntityOfPage: canonicalUrl,
    author: {
      '@type': 'Person',
      name: 'Pittawat Taveekitworachai',
      url: authorUrl,
      sameAs: authorSameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PETEPITTAWAT.DEV',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.svg', siteUrl).href,
      },
    },
    image: imageUrl,
    url: canonicalUrl,
    ...(seriesSlug && seriesTitle
      ? {
          isPartOf: {
            '@type': 'BlogSeries',
            name: seriesTitle,
            url: new URL('/series/', siteUrl).href,
          },
          position: seriesOrder || undefined,
        }
      : {}),
  };
}

interface BlogPostMetadata {
  canonicalUrl: string;
  imageUrl: string;
  authorUrl: string;
  authorSameAs: string[];
  coverOrientation: 'portrait' | 'landscape';
  visibleTags: string[];
  hiddenTagCount: number;
}

export function computeBlogPostMetadata(params: {
  slug?: string | undefined;
  coverImage?: any;
  tags?: string[] | undefined;
  site?: URL | undefined;
  twitterHandle?: string | undefined;
}): BlogPostMetadata {
  const { slug, coverImage, tags = [], site, twitterHandle } = params;

  const authorUrl = site ? new URL('/about', site).href : '/about';
  const canonicalUrl = slug
    ? site
      ? new URL(`/blog/${slug}/`, site).href
      : `/blog/${slug}/`
    : '/';

  const fallback = slug ? `/og/blog/${slug}.png` : '/home-og-image.jpeg';
  const src = coverImage?.src ?? fallback;
  const imageUrl = site ? new URL(src, site).href : src;

  const coverOrientation =
    coverImage && typeof coverImage === 'object' && 'width' in coverImage && 'height' in coverImage
      ? Number(coverImage.width) < Number(coverImage.height)
        ? 'portrait'
        : 'landscape'
      : 'landscape';

  const authorSameAs: string[] = [];
  if (twitterHandle) {
    const handle = twitterHandle.startsWith('@') ? twitterHandle.slice(1) : twitterHandle;
    authorSameAs.push(`https://twitter.com/${handle}`);
  }
  authorSameAs.push(authorUrl);

  const maxTagsToShow = 6;
  const visibleTags = tags.slice(0, maxTagsToShow);
  const hiddenTagCount = Math.max(0, tags.length - maxTagsToShow);

  return {
    canonicalUrl,
    imageUrl,
    authorUrl,
    authorSameAs,
    coverOrientation,
    visibleTags,
    hiddenTagCount,
  };
}
