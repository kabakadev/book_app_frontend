/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Keep as "class" unless you want media-query-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Keep only necessary paths
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background, 26, 26, 26))", // Added fallback value
        foreground: "hsl(var(--foreground, 240, 240, 240))",
        primary: {
          DEFAULT: "hsl(var(--primary, 40, 70, 50))",
          foreground: "hsl(var(--primary-foreground, 0, 0, 0))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 45, 50, 40))",
          foreground: "hsl(var(--secondary-foreground, 0, 0, 0))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        background: "#1a1a1a",
        card: "#2c2c2c",
        primary: "#c19a6b",
        secondary: "#8f7e4f",
        accent: "#d8b384",
        text: {
          primary: "#e0e0e0",
          secondary: "#b0bec5",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius, 8px)", // Added default values
        md: "calc(var(--radius, 8px) - 2px)",
        sm: "calc(var(--radius, 8px) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
