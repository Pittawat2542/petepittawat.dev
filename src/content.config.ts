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
  const items = JSON.parse(fileContent) as T[];
  return items.map((item, index) => ({
    id: getId(item, index),
    ...item,
  }));
};

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
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
    }),
});

const talkResourceSchema = z.object({
  label: z.string(),
  href: z.string().min(1),
  download: z.boolean().optional(),
});

const talkSchema = z.object({
  date: z.string(),
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
    parser: fileContent =>
      parseJsonArray(fileContent, (item: z.infer<typeof talkSchema>, index) => {
        return `${item.date}-${toId(item.title) || index.toString()}`;
      }),
  }),
  schema: talkSchema,
});

const publications = defineCollection({
  loader: file('./src/content/publications/publications.json', {
    parser: fileContent =>
      parseJsonArray(fileContent, (item: z.infer<typeof publicationSchema>, index) => {
        return `${item.year}-${toId(item.title) || index.toString()}`;
      }),
  }),
  schema: publicationSchema,
});

const projects = defineCollection({
  loader: file('./src/content/projects/projects.json', {
    parser: fileContent =>
      parseJsonArray(fileContent, (item: z.infer<typeof projectSchema>, index) => {
        return `${item.year}-${toId(item.title) || index.toString()}`;
      }),
  }),
  schema: projectSchema,
});

const about = defineCollection({
  loader: file('./src/content/about/timeline.json', {
    parser: fileContent =>
      parseJsonArray(fileContent, (item: z.infer<typeof aboutTimelineItemSchema>, index) => {
        return `${toId(item.title) || 'timeline-item'}-${index}`;
      }),
  }),
  schema: aboutTimelineItemSchema,
});

export const collections = {
  about,
  blog,
  projects,
  publications,
  talks,
};
