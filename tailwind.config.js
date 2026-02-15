import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00", // Pinak’s orange brand color
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        localchefTheme: {
          primary: "#FF6B00",
          secondary: "#F9A825",
          accent: "#4CAF50",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
};
