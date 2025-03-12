/** @type {import('tailwindcss').Config} */
import tailwindcssMotion from 'tailwindcss-motion';
import typography from '@tailwindcss/typography';

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
    },
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
  },
  plugins: [
    tailwindcssMotion,
    typography,
  ],
};
