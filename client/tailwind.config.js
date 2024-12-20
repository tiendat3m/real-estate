/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#091a2b',
				main: '#005163',
				secondary: '#f1f3f4',
			},
			backgroundColor: {
				main: '#005163',
				primary: '#f1f3f4',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}