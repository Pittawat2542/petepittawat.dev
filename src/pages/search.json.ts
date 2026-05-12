import type { APIContext } from 'astro';
import { siteCopyEn } from '@/data/site/copy';
import {
  getBlogPostPath,
  getPreferredBlogPosts,
  groupBlogPostsByTranslation,
} from '@/lib/blog-translations';
import { getBlogPosts, getProjects, getPublications, getTalks } from '@/lib/content';
import { slugify } from '@/lib/slug';
import type { SearchItem, SearchItemVariant } from '@/components/search/types';

export const prerender = true;

type SearchLocale = 'en' | 'th';

function createEnglishItem(
  item: Omit<
    SearchItem,
    'locale' | 'availableLocales' | 'locales' | 'localizedUrl' | 'alternateUrl'
  > & {
    path: string;
  }
): SearchItem {
  return {
    id: item.id,
    type: item.type,
    locale: 'en',
    availableLocales: ['en'],
    title: item.title,
    description: item.description,
    localizedUrl: item.path,
    tags: item.tags,
    date: item.date,
    extra: item.extra,
  };
}

export async function GET(_context: APIContext) {
  const items: SearchItem[] = [];
  const [blogPosts, projects, publications, talks] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getPublications(),
    getTalks(),
  ]);

  const groupedBlogPosts = groupBlogPostsByTranslation(blogPosts);
  const canonicalBlogPosts = getPreferredBlogPosts(groupedBlogPosts, 'en');

  for (const canonicalPost of canonicalBlogPosts) {
    const translationId = canonicalPost.data.translationId ?? canonicalPost.data.slug;
    const group = groupedBlogPosts[translationId] ?? [canonicalPost];
    const enPost = group.find(post => post.data.lang === 'en');
    const thPost = group.find(post => post.data.lang === 'th');
    const locales: Partial<Record<SearchLocale, SearchItemVariant>> | undefined =
      enPost && thPost
        ? {
            en: {
              title: enPost.data.title,
              description: enPost.data.excerpt,
              localizedUrl: getBlogPostPath(enPost),
              tags: enPost.data.tags,
              date: enPost.data.pubDate.toISOString(),
            },
            th: {
              title: thPost.data.title,
              description: thPost.data.excerpt,
              localizedUrl: getBlogPostPath(thPost),
              tags: thPost.data.tags,
              date: thPost.data.pubDate.toISOString(),
            },
          }
        : undefined;
    const alternatePost =
      canonicalPost.data.lang === 'en'
        ? thPost
        : canonicalPost.data.lang === 'th'
          ? enPost
          : undefined;

    items.push({
      id: `blog:${translationId}`,
      type: 'blog',
      locale: canonicalPost.data.lang,
      translationId,
      availableLocales: locales ? ['en', 'th'] : [canonicalPost.data.lang],
      title: canonicalPost.data.title,
      description: canonicalPost.data.excerpt,
      localizedUrl: getBlogPostPath(canonicalPost),
      alternateUrl: alternatePost ? getBlogPostPath(alternatePost) : undefined,
      tags: canonicalPost.data.tags,
      date: canonicalPost.data.pubDate.toISOString(),
      locales,
    });
  }

  for (const project of projects) {
    const anchor = `project-${slugify(project.title)}-${project.year}`;
    items.push(
      createEnglishItem({
        id: `project:${project.title}-${project.year}`,
        type: 'project',
        title: project.title,
        description: project.summary,
        path: `/projects#${anchor}`,
        tags: project.tags,
        date: project.year,
        extra: {},
      })
    );
  }

  for (const publication of publications) {
    const anchor = `pub-${slugify(publication.title)}-${publication.year}`;
    items.push(
      createEnglishItem({
        id: `publication:${publication.title}-${publication.year}`,
        type: 'publication',
        title: publication.title,
        description: `${publication.authors} — ${publication.venue}`,
        path: `/publications#${anchor}`,
        tags: publication.tags,
        date: publication.year,
        extra: { venue: publication.venue, type: publication.type },
      })
    );
  }

  for (const talk of talks) {
    const year = talk.date.getFullYear();
    const anchor = `talk-${slugify(talk.title)}-${year}`;
    items.push(
      createEnglishItem({
        id: `talk:${talk.title}-${talk.date.toISOString()}`,
        type: 'talk',
        title: talk.title,
        description: `${talk.audience} — ${talk.mode}`,
        path: `/talks#${anchor}`,
        tags: talk.tags,
        date: talk.date.toISOString(),
      })
    );
  }

  items.push(
    createEnglishItem({
      id: 'page:home',
      type: 'page',
      title: siteCopyEn.listingPages.home.title,
      path: siteCopyEn.listingPages.home.path,
      description: siteCopyEn.listingPages.home.searchDescription,
    }),
    createEnglishItem({
      id: 'page:blog',
      type: 'page',
      title: siteCopyEn.listingPages.blog.title,
      path: siteCopyEn.listingPages.blog.path,
      description: siteCopyEn.listingPages.blog.searchDescription,
    }),
    createEnglishItem({
      id: 'page:projects',
      type: 'page',
      title: siteCopyEn.listingPages.projects.title,
      path: siteCopyEn.listingPages.projects.path,
      description: siteCopyEn.listingPages.projects.searchDescription,
    }),
    createEnglishItem({
      id: 'page:publications',
      type: 'page',
      title: siteCopyEn.listingPages.publications.title,
      path: siteCopyEn.listingPages.publications.path,
      description: siteCopyEn.listingPages.publications.searchDescription,
    }),
    createEnglishItem({
      id: 'page:talks',
      type: 'page',
      title: siteCopyEn.listingPages.talks.title,
      path: siteCopyEn.listingPages.talks.path,
      description: siteCopyEn.listingPages.talks.searchDescription,
    }),
    createEnglishItem({
      id: 'page:about',
      type: 'page',
      title: siteCopyEn.listingPages.about.title,
      path: siteCopyEn.listingPages.about.path,
      description: siteCopyEn.listingPages.about.searchDescription,
    })
  );

  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
