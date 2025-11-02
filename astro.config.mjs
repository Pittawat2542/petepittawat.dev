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
		inlineStylesheets: 'always',
		split: true, // Enable code splitting
		format: 'file', // Use file format for better caching
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
			minify: 'esbuild',
			cssMinify: 'esbuild',
			reportCompressedSize: false, // Disable for faster builds
			rollupOptions: {
				output: {
					// Split vendor by real package (robust for pnpm store),
					// and co-locate React + scheduler to avoid runtime mismatches.
					manualChunks(id) {
						if (!id.includes('node_modules')) return;
						// Keep React stack together (including compiler runtime for React 19)
						if (id.includes('/react-dom/')) return 'vendor-react';
						if (id.includes('/react/')) return 'vendor-react';
						if (id.includes('/scheduler/')) return 'vendor-react';
						if (id.includes('/react-compiler-runtime/')) return 'vendor-react';
						// Other common groups
						if (id.includes('/@radix-ui/')) return 'vendor-radix-ui';
						if (id.includes('/lucide-')) return 'vendor-lucide';

						// Extract the actual package name even with pnpm's .pnpm indirection
						try {
							const after = id.split('node_modules/')[1];
							const segs = after.split('/');
							let pkg;
							if (segs[0] === '.pnpm') {
								const nmIdx = segs.indexOf('node_modules');
								if (nmIdx !== -1 && nmIdx + 1 < segs.length) {
									pkg = segs[nmIdx + 1];
									if (pkg?.startsWith('@') && nmIdx + 2 < segs.length) {
										pkg = `${pkg}/${segs[nmIdx + 2]}`;
									}
								}
							} else {
								pkg = segs[0].startsWith('@') ? `${segs[0]}/${segs[1]}` : segs[0];
							}
							if (!pkg) return;
							return `vendor-${pkg.replace('@', '').replace('/', '-')}`;
						} catch {
							// Let Vite decide if we can't parse
							return;
						}
					},
				},
			},
		},
		optimizeDeps: {
			include: ['react', 'react-dom', 'react-compiler-runtime', 'lucide-react'],
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
