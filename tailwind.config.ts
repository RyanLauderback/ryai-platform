import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d1526",
        brand: { 50: "#eef4ff", 100: "#dbe8ff", 500: "#356df3", 600: "#2858d7", 700: "#234bb4" },
        mint: "#56d6b1",
      },
      boxShadow: { soft: "0 20px 60px rgba(13, 21, 38, .10)" },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
