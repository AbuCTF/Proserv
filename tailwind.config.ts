import type { Config } from "tailwindcss";

export default {
  // Enable dark mode using class-based approach
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Extend color palette to support dark mode
      colors: {
        background: {
          DEFAULT: "var(--background)",
          dark: "var(--background-dark)", // New dark mode background
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          dark: "var(--foreground-dark)", // New dark mode foreground
        },
        // Optional: Add more custom color variations
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;