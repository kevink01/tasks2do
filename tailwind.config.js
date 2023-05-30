/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'node_modules/daisyui/dist/**/*.js',
		'node_modules/react-daisyui/dist/**/*.js',
	],
	theme: {},
	plugins: [require('daisyui')],
	daisyui: {
		base: false,
		themes: [
			'light',
			'dark',
			{
				mytheme: {
					primary: '#fde047',
					secondary: '#fde047',
					accent: '#44403c',
					neutral: '#191D24',
					'base-100': '#f97316',
					info: '#3ABFF8',
					success: '#36D399',
					warning: '#FBBD23',
					error: '#F87272',
				},
			},
		],
	},
};
