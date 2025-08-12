import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://petepittawat.dev',
	integrations: [mdx(), sitemap(), react(), tailwind(), robotsTxt()],
	compressHTML: true,
});
