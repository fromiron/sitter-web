/** @type {import('tailwindcss').Config} */

const PRIMARY_COLOR = "#fa8072"
const PRIMARY_COLOR_FOCUS = "#c8665b"

module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}",], theme: {
        extend: {},
    }, daisyui: {
        themes: [{
            dwarf: {
                primary: "#fa8072",
                "primary-accent": "#fa8072",
                secondary: "#5C6AC4",
                accent: "#FFEC00",
                neutral: "#161D25",
                "base-100": "#fffcfa",
                "base-200": "#D2D2D2",
                "base-300": "#919EAB",
                info: "#3ABFF8",
                success: "#36D399",
                warning: "#FBBD23",
                error: "#F87272",
            },
        },],
    }, plugins: [require("daisyui")],
};
