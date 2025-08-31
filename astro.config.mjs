import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

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
		tailwind({
			applyBaseStyles: false, // Use custom base styles for better performance
		}),
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
        inlineStylesheets: 'always',
        split: true, // Enable code splitting
        format: 'file', // Use file format for better caching
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
		build: {
			minify: 'esbuild',
			cssMinify: 'esbuild',
			reportCompressedSize: false, // Disable for faster builds
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							if (id.includes('react')) return 'react-vendor';
							if (id.includes('@radix-ui')) return 'radix-vendor';
							if (id.includes('lucide')) return 'lucide-vendor';
							return 'vendor';
						}
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
