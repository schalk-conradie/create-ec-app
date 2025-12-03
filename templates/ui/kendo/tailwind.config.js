/** @type {import('tailwindcss').Config} */

import kendoTwPreset from "./kendo-tw-preset.js";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	presets: [kendoTwPreset],
	theme: {
		extend: {
			colors: {},
		},
	},
	plugins: [],
};
