/** @type {import('tailwindcss').Config} */

const componentsCustomConfig = {
    ".input": {
        "transition-duration": "500ms",
    },
    ".input:focus": {
        outline: "none",
    },
    ".btn": {
        outline: "none",
        "border-radius": "0.375rem" /* 6px MD */,
        "text-transform": "none",
        "font-weight": "normal",
    },
    ".btn:focus": {
        outline: "none",
    },
    ".btn:hover": {
        outline: "none",
    },
    th: {
        'font-weight': "normal",
    },
    select: {
        "-webkit-appearance": "none",
        "-moz-appearance": "none",
        appearance: "none",
    },
};

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontSize: {
                xxs: "0.5rem"
            },
            fontFamily: {
                mpr: ["Libre BaskervilleM PLUS Rounded 1c", "sans-serif"],
            },
            dropShadow: {
                glow: [
                    "1px 2px 2px rgba( 	255, 115, 190, 0.3)",
                    "0 0 4px rgb(92,60,171, 0.3)",
                ],
                "glow-hover": [
                    "1px 2px 3px rgba( 	255, 115, 190, 0.9)",
                    "-10px -4px 4px rgb(92,60,171, 0.7)",
                ],
            },
        },
    },
    daisyui: {
        themes: [
            {
                dwarf: {
                    primary: "#5c3cab",
                    "primary-focus": "#42275d",
                    "primary-content": "#ffffff",
                    secondary: "#ff73be",
                    "secondary-focus": "#b9508a",
                    "secondary-content": "#6a3a54",
                    accent: "#37cdbe",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    neutral: "#32303d",
                    "neutral-focus": "#110f1c",
                    "neutral-content": "#ffffff",
                    "base-100": "#F4F4F5",
                    "base-content": "#110f1c",
                    info: "#66c6ff",
                    success: "#87d039",
                    warning: "#e2d562",
                    error: "#ff6f6f",
                    ...componentsCustomConfig,
                },

                lop: {
                    primary: "#42275d",
                    "primary-content": "#ffffff",
                    secondary: "#b9508a",
                    accent: "#ffe999",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    neutral: "#535353",
                    "base-100": "#110f1c",
                    "base-200": "#56555f",
                    "base-300": "#d2d2d4",
                    "base-content": "#F4F4F5",
                    info: "#2563eb",
                    success: "#16a34a",
                    warning: "#d97706",
                    error: "#dc2626",
                    ...componentsCustomConfig,
                },
            },
        ],
        darkTheme: "lop",
    },
    plugins: [require("daisyui")],
};
