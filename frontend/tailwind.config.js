/** @type {import('tailwindcss').Config} */

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
                dwarf: {
                    primary: "#5c3cab",
                    "primary-focus": "#42275d",
                    "primary-content": "#2e1e57",
                    secondary: "#ff73be",
                    "secondary-focus": "#b9508a",
                    "secondary-content": "#6a3a54",
                    accent: "#37cdbe",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    neutral: "#110f1c",
                    "base-100": "#F4F4F5",
                    "base-content": "#110f1c",
                    info: "#66c6ff",
                    success: "#87d039",
                    warning: "#e2d562",
                    error: "#ff6f6f",
                },
            },
        ],
    },
    plugins: [require("daisyui")],
};
