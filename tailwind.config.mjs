/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
			},
			keyframes: {
				shake: {
					'10%, 90%': {
						transform: 'rotate(-0.005turn)',
					},
					'20%, 80%': {
						transform: 'rotate(0.005turn)',
					},
					'30%, 50%, 70%': {
						transform: 'rotate(-0.015turn)',
					},
					'40%, 60%': {
						transform: 'rotate(0.015turn)',
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
