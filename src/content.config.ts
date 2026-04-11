import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const toId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseJsonArray = <T extends Record<string, unknown>>(
  fileContent: string,
  getId: (item: T, index: number) => string
) => {
  const callerName = getId.name || 'anonymous';
  let items: T[];

  try {
    items = JSON.parse(fileContent) as T[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const preview = fileContent.trim().slice(0, 120).replace(/\s+/g, ' ');
    throw new Error(
      `parseJsonArray failed for ${callerName}: could not parse JSON input "${preview}" (${message})`
    );
  }

  if (!Array.isArray(items)) {
    throw new Error(`parseJsonArray failed for ${callerName}: expected a JSON array at the root`);
  }

  return items.map((item, index) => ({
    ...item,
    id: getId(item, index),
  }));
};

const hasMatchingSeriesMetadata = (
  value: { seriesSlug?: string | undefined; seriesTitle?: string | undefined },
  ctx: z.RefinementCtx
) => {
  const hasSeriesSlug = Boolean(value.seriesSlug);
  const hasSeriesTitle = Boolean(value.seriesTitle);

  if (hasSeriesSlug !== hasSeriesTitle) {
    ctx.addIssue({
      code: 'custom',
      message: 'seriesSlug and seriesTitle must both be present or both absent.',
      path: hasSeriesSlug ? ['seriesTitle'] : ['seriesSlug'],
    });
  }
};

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z
      .object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        tags: z.array(z.string()),
        pubDate: z.coerce.date(),
        coverImage: image().optional(),
        seriesSlug: z.string().optional(),
        seriesTitle: z.string().optional(),
        seriesOrder: z.number().optional(),
        seriesDescription: z.string().optional(),
        externalUrl: z.url().optional(),
      })
      .superRefine(hasMatchingSeriesMetadata),
});

const talkResourceSchema = z.object({
  label: z.string(),
  href: z.string().min(1),
  download: z.boolean().optional(),
});

const talkSchema = z.object({
  date: z.coerce.date(),
  title: z.string(),
  audience: z.string(),
  audienceUrl: z.url().nullable(),
  mode: z.string(),
  resources: z.array(talkResourceSchema),
  tags: z.array(z.string()),
});

const publicationArtifactSchema = z.object({
  label: z.string(),
  href: z.string().min(1),
});

const publicationSchema = z.object({
  year: z.number(),
  type: z.string(),
  title: z.string(),
  authors: z.string(),
  venue: z.string(),
  url: z.url().nullable(),
  artifacts: z.array(publicationArtifactSchema),
  tags: z.array(z.string()),
  abstract: z.string().optional(),
});

const projectLinkSchema = z.object({
  label: z.string(),
  href: z.string().min(1),
});

const projectSchema = z.object({
  year: z.number(),
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  links: z.array(projectLinkSchema),
  role: z.string().optional(),
  collaborators: z.string().optional(),
  type: z.string().optional(),
});

const aboutTimelineItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  accent: z.string(),
  highlight: z.boolean().optional(),
});

const talks = defineCollection({
  loader: file('./src/content/talks/talks.json', {
    parser: fileContent => parseJsonArray(fileContent, getTalkId),
  }),
  schema: talkSchema,
});

const publications = defineCollection({
  loader: file('./src/content/publications/publications.json', {
    parser: fileContent => parseJsonArray(fileContent, getPublicationId),
  }),
  schema: publicationSchema,
});

const projects = defineCollection({
  loader: file('./src/content/projects/projects.json', {
    parser: fileContent => parseJsonArray(fileContent, getProjectId),
  }),
  schema: projectSchema,
});

const about = defineCollection({
  loader: file('./src/content/about/timeline.json', {
    parser: fileContent => parseJsonArray(fileContent, getAboutTimelineItemId),
  }),
  schema: aboutTimelineItemSchema,
});

function getTalkId(item: z.infer<typeof talkSchema>, index: number) {
  const dateStr = item.date instanceof Date ? item.date.toISOString().split('T')[0] : String(item.date).split('T')[0];
  return `${dateStr}-${toId(item.title) || index.toString()}`;
}

function getYearTitleId(item: { year: number; title: string }, index: number) {
  return `${item.year}-${toId(item.title) || index.toString()}`;
}

function getPublicationId(item: z.infer<typeof publicationSchema>, index: number) {
  return getYearTitleId(item, index);
}

function getProjectId(item: z.infer<typeof projectSchema>, index: number) {
  return getYearTitleId(item, index);
}

function getAboutTimelineItemId(item: z.infer<typeof aboutTimelineItemSchema>, index: number) {
  return `${toId(item.title) || 'timeline-item'}-${index}`;
}

export const collections = {
  about,
  blog,
  projects,
  publications,
  talks,
};
