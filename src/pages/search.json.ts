import type { APIContext } from 'astro';
import { siteCopyEn } from '@/data/site/copy';
import { getBlogPosts, getProjects, getPublications, getTalks } from '@/lib/content';
import { localizePath } from '@/i18n/utils';
import { slugify } from '@/lib/slug';

export const prerender = true;

type SearchItemType = 'blog' | 'project' | 'publication' | 'talk' | 'page';
type SearchLocale = 'en' | 'th';
type SearchItemLocale = SearchLocale | 'neutral';
type SearchExtra = Record<string, string | number | boolean | null | undefined>;

type SearchItemVariant = {
  title: string;
  description?: string | undefined;
  localizedUrl: string;
  tags?: string[] | undefined;
  date?: string | number | undefined;
  extra?: SearchExtra | undefined;
};

type SearchItem = {
  id: string;
  type: SearchItemType;
  locale: SearchItemLocale;
  translationId?: string | undefined;
  availableLocales: SearchLocale[];
  title: string;
  description?: string | undefined;
  localizedUrl: string;
  alternateUrl?: string | undefined;
  tags?: string[] | undefined;
  date?: string | number | undefined;
  extra?: SearchExtra | undefined;
  locales?: Partial<Record<SearchLocale, SearchItemVariant>> | undefined;
};

function createNeutralItem(
  item: Omit<SearchItem, 'locale' | 'availableLocales' | 'locales' | 'localizedUrl'> & {
    path: string;
  }
): SearchItem {
  const enUrl = localizePath(item.path, 'en');
  const thUrl = localizePath(item.path, 'th');
  const baseVariant = {
    title: item.title,
    description: item.description,
    tags: item.tags,
    date: item.date,
    extra: item.extra,
  };

  return {
    id: item.id,
    type: item.type,
    locale: 'neutral',
    availableLocales: ['en', 'th'],
    title: item.title,
    description: item.description,
    localizedUrl: enUrl,
    alternateUrl: thUrl,
    tags: item.tags,
    date: item.date,
    extra: item.extra,
    locales: {
      en: { ...baseVariant, localizedUrl: enUrl },
      th: { ...baseVariant, localizedUrl: thUrl },
    },
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

  const groupedBlogPosts = blogPosts.reduce(
    (acc, post) => {
      const key = post.data.translationId || post.data.slug;
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    },
    {} as Record<string, typeof blogPosts>
  );

  for (const [translationId, group] of Object.entries(groupedBlogPosts)) {
    const enPost = group.find(post => post.data.lang === 'en');
    const thPost = group.find(post => post.data.lang === 'th');
    const canonicalPost = enPost || thPost;

    if (!canonicalPost) continue;

    const locales: Partial<Record<SearchLocale, SearchItemVariant>> = {};
    if (enPost) {
      locales.en = {
        title: enPost.data.title,
        description: enPost.data.excerpt,
        localizedUrl: localizePath(`/blog/${enPost.data.slug}/`, 'en'),
        tags: enPost.data.tags,
        date: enPost.data.pubDate.toISOString(),
      };
    }
    if (thPost) {
      locales.th = {
        title: thPost.data.title,
        description: thPost.data.excerpt,
        localizedUrl: localizePath(`/blog/${thPost.data.slug}/`, 'th'),
        tags: thPost.data.tags,
        date: thPost.data.pubDate.toISOString(),
      };
    }

    const availableLocales = (['en', 'th'] as const).filter(locale => locales[locale]);
    const canonicalLocale = enPost ? 'en' : 'th';
    const canonicalVariant = locales[canonicalLocale];
    const alternateVariant = canonicalLocale === 'en' ? locales.th : locales.en;

    if (!canonicalVariant) continue;

    items.push({
      id: `blog:${translationId}`,
      type: 'blog',
      locale: canonicalLocale,
      translationId,
      availableLocales: [...availableLocales],
      title: canonicalVariant.title,
      description: canonicalVariant.description,
      localizedUrl: canonicalVariant.localizedUrl,
      alternateUrl: alternateVariant?.localizedUrl,
      tags: canonicalVariant.tags,
      date: canonicalVariant.date,
      locales,
    });
  }

  for (const project of projects) {
    const anchor = `project-${slugify(project.title)}-${project.year}`;
    items.push(
      createNeutralItem({
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
      createNeutralItem({
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
      createNeutralItem({
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
    createNeutralItem({
      id: 'page:home',
      type: 'page',
      title: siteCopyEn.listingPages.home.title,
      path: siteCopyEn.listingPages.home.path,
      description: siteCopyEn.listingPages.home.searchDescription,
    }),
    createNeutralItem({
      id: 'page:blog',
      type: 'page',
      title: siteCopyEn.listingPages.blog.title,
      path: siteCopyEn.listingPages.blog.path,
      description: siteCopyEn.listingPages.blog.searchDescription,
    }),
    createNeutralItem({
      id: 'page:projects',
      type: 'page',
      title: siteCopyEn.listingPages.projects.title,
      path: siteCopyEn.listingPages.projects.path,
      description: siteCopyEn.listingPages.projects.searchDescription,
    }),
    createNeutralItem({
      id: 'page:publications',
      type: 'page',
      title: siteCopyEn.listingPages.publications.title,
      path: siteCopyEn.listingPages.publications.path,
      description: siteCopyEn.listingPages.publications.searchDescription,
    }),
    createNeutralItem({
      id: 'page:talks',
      type: 'page',
      title: siteCopyEn.listingPages.talks.title,
      path: siteCopyEn.listingPages.talks.path,
      description: siteCopyEn.listingPages.talks.searchDescription,
    }),
    createNeutralItem({
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
