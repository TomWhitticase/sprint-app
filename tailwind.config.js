/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",

    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "system-grey": {
          veryLight: "#343541",
          light: "#2A2B32",
          DEFAULT: "#202123",
          dark: "#1a1a1d",
          text: "#e1e1e1",
        },
        "system-blue": {
          veryLight: "#3F466A",
          light: "#353B5A",
          DEFAULT: "#191F3F",
          dark: "#080E2E",
          text: "#737999",
        },
        "todo-red": {
          DEFAULT: "#D28888",
          text: "#710F0F",
        },
        "in-progress-blue": {
          DEFAULT: "#88BBD2",
          text: "#0F4C71",
        },
        "review-amber": {
          DEFAULT: "#F2D388",
          text: "#7F5F0F",
        },
        "completed-green": {
          DEFAULT: "#88D2A3",
          text: "#0F714C",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities, addVariant }) {
      addUtilities({
        ".border-3": {
          "border-width": "3px",
        },
      });
      addVariant(
        "mobile-only",
        "@media screen and (max-width: theme('screens.sm'))"
      ); // instead of hard-coded 640px use sm breakpoint value from config. Or anything
      addVariant(
        "desktop-only",
        "@media screen and (min-width: theme('screens.md'))"
      );
    },
  ],
};
