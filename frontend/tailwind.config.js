/** @type {import('tailwindcss').Config} */

const PRIMARY_COLOR = "#fa8072"
const PRIMARY_COLOR_FOCUS = "#c8665b"

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/colors/themes")["[data-theme=light]"],
                    "primary": PRIMARY_COLOR,
                    "primary-focus": PRIMARY_COLOR_FOCUS,
                },
            },
            {
                dark: {
                    ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
                    "primary": PRIMARY_COLOR,
                    "primary-focus": PRIMARY_COLOR_FOCUS,
                },
            },
        ],
    },
    plugins: [require("daisyui")],
};
