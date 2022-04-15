module.exports = {
	content: ['./src/**/*.{ts,svelte,html,js}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
