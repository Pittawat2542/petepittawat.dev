/**
 * Generate JSON-LD schema for blog posts
 */

import { getBlogOgImagePath } from './blog-cover/index.ts';
import { getBlogPostPath, type BlogTranslationLocale } from './blog-translations.ts';

interface BlogPostSchemaParams {
  title: string;
  excerpt: string;
  pubDate: Date;
  wordCount?: number | undefined;
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
    wordCount,
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
    ...(typeof wordCount === 'number' && wordCount > 0 ? { wordCount } : {}),
    ...(seriesSlug && seriesTitle
      ? {
          isPartOf: {
            '@type': 'BlogSeries',
            name: seriesTitle,
            url: new URL('/series/', siteUrl).href,
          },
          position: seriesOrder ?? undefined,
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
  lang?: BlogTranslationLocale | undefined;
  tags?: string[] | undefined;
  site?: URL | undefined;
  twitterHandle?: string | undefined;
}): BlogPostMetadata {
  const { slug, lang = 'en', tags = [], site, twitterHandle } = params;

  const authorUrl = site ? new URL('/about', site).href : '/about';
  const blogPostPath = slug ? getBlogPostPath({ data: { slug, lang } }) : '/';
  const canonicalUrl = slug ? (site ? new URL(blogPostPath, site).href : blogPostPath) : '/';

  const src = slug ? getBlogOgImagePath({ lang, routeSlug: slug }) : '/home-og-image.jpeg';
  const imageUrl = site ? new URL(src, site).href : src;

  const coverOrientation = 'landscape';

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
