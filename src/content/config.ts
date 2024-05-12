import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		excerpt: z.string(),
		tags: z.array(z.string()),
		pubDate: z.coerce.date(),
		coverImage: image().optional(),
	}),
});

export const collections = { blog };
