import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://petepittawat.dev',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
		}),
		react(),
		robotsTxt({
			sitemap: 'https://petepittawat.dev/sitemap-index.xml',
		}),
	],
	compressHTML: true,
	// Performance optimizations
	prefetch: {
		// Avoid prefetching non-critical routes/assets on first paint
		prefetchAll: false,
		defaultStrategy: 'hover',
	},
	build: {
		// Inline all page CSS to remove render‑blocking stylesheet requests
		// inlineStylesheets: 'always',
		split: true, // Enable code splitting
		format: 'directory', // Use directory format for GitHub Pages compatibility
		concurrency: 4, // Parallel builds for better performance
	},
	output: 'static',
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
			config: {
				limitInputPixels: false,
			},
		},
		remotePatterns: [{ protocol: 'https' }],
		formats: ['avif', 'webp', 'svg'],
		quality: 80,
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			reportCompressedSize: false, // Disable for faster builds
			rolldownOptions: {
				output: {
					codeSplitting: {
						groups: [
							{
								name: 'vendor-react',
								test: /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(?:react|react-dom|scheduler|lucide-react|@radix-ui)\//,
							},
						],
					},
				},
			},
		},
		optimizeDeps: {
			include: ['react', 'react-dom', 'lucide-react'],
		},
	},
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
			wrap: true,
		},
	},
	security: {
		checkOrigin: true,
	},
});
