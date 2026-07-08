import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#EF6D54",
          dark: "#E0543A",
          light: "#FBE4DC",
        },
        ink: {
          DEFAULT: "#262A40",
          soft: "#5C6072",
        },
        cream: "#FFFBF8",
        peach: "#FBEDE7",
        grape: { DEFAULT: "#8A6FB0", soft: "#EDE6F5" },
        sky: { DEFAULT: "#4C86C6", soft: "#E3EFF9" },
        gold: { DEFAULT: "#E79B3C", soft: "#FaE7C9" },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(38, 42, 64, 0.15)",
        float: "0 20px 45px -15px rgba(38, 42, 64, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
