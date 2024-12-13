/** @type {import('tailwindcss').Config} */
module.exports = {
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-motion"), require('@tailwindcss/typography')],
};
