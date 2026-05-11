import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        primary: "#16a34a",
        secondary: "#eab308",
        dark: "#14532d",
        light: "#f0fdf4",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        localchef: {
          primary: "#16a34a",
          secondary: "#eab308",
          accent: "#bbf7d0",
          neutral: "#14532d",
          "base-100": "#f0fdf4",
          "base-200": "#dcfce7",
          "base-300": "#bbf7d0",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
