import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      tags: z.array(z.string()),
      pubDate: z.coerce.date(),
      coverImage: image().optional(),
      // Series support
      seriesSlug: z.string().optional(),
      seriesTitle: z.string().optional(),
      seriesOrder: z.number().optional(),
      seriesDescription: z.string().optional(),
      externalUrl: z.string().url().optional(),
    }),
});
// Data collections: validate JSON array shape with Zod
const talkResourceSchema = z.object({
  label: z.string(),
  href: z.string().min(1), // allow relative or absolute URLs
  download: z.boolean().optional(),
});

const talkSchema = z.object({
  date: z.string(),
  title: z.string(),
  audience: z.string(),
  audienceUrl: z.string().url().nullable(),
  mode: z.string(),
  resources: z.array(talkResourceSchema),
  tags: z.array(z.string()),
});

const publicationArtifactSchema = z.object({
  label: z.string(),
  href: z.string().min(1), // allow relative or absolute URLs
});

const publicationSchema = z.object({
  year: z.number(),
  type: z.string(),
  title: z.string(),
  authors: z.string(),
  venue: z.string(),
  url: z.string().url().nullable(),
  artifacts: z.array(publicationArtifactSchema),
  tags: z.array(z.string()),
});

const talks = defineCollection({ type: 'data', schema: z.array(talkSchema) });
const publications = defineCollection({ type: 'data', schema: z.array(publicationSchema) });
// Projects collection
const projectLinkSchema = z.object({ label: z.string(), href: z.string().min(1) });
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
const projects = defineCollection({ type: 'data', schema: z.array(projectSchema) });
// About timeline collection to avoid auto-generated warnings
const aboutTimelineItem = z.object({
  title: z.string(),
  description: z.string(),
  accent: z.string(),
  highlight: z.boolean().optional(),
});
const about = defineCollection({ type: 'data', schema: z.array(aboutTimelineItem) });

export const collections = { blog, talks, publications, projects, about };
