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
                    // darkは使えないけどHEX保存用
                    // "primary-dark": "#2e1e57",
                    "primary-content": "#ffffff",
                    secondary: "#ff73be",
                    "secondary-focus": "#b9508a",
                    "secondary-content": "#6a3a54",
                    accent: "#37cdbe",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    neutral: "#32303d",
                    "neutral-focus": "#110f1c",
                    "neutral-content": "#f2f1f6",
                    "base-100": "#F4F4F5",
                    "base-content": "#110f1c",
                    info: "#66c6ff",
                    success: "#87d039",
                    warning: "#e2d562",
                    error: "#ff6f6f",
                    ".input": {
                        "transition-duration": "500ms",
                    },
                    ".input:focus": {
                        outline: "none",
                    },
                    ".btn:focus": {
                        outline: "none",
                    },
                },

                lop: {
                    primary: "#b9508a",
                    "primary-focus": "#42275d",
                    // darkは使えないけどHEX保存用
                    // "primary-dark": "#2e1e57",
                    "primary-content": "#ffffff",
                    secondary: "#ff73be",
                    "secondary-focus": "#b9508a",
                    "secondary-content": "#6a3a54",
                    accent: "#6a3a54",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#ffffff",
                    neutral: "#6a3a54",
                    "neutral-focus": "#b9508a",
                    "neutral-content": "#ff6f6f",
                    "base-100": "#110f1c",
                    "base-content": "#F4F4F5",
                    info: "#66c6ff",
                    success: "#87d039",
                    warning: "#e2d562",
                    error: "#ff6f6f",
                    ".input": {
                        "transition-duration": "500ms",
                    },
                    ".input:focus": {
                        outline: "none",
                    },
                    ".btn:focus": {
                        outline: "none",
                    },
                },
            },
        ],
        darkTheme: "lop",
    },
    plugins: [require("daisyui")],
};
