import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#1e1e2e",
        input: "#1e1e2e",
        ring: "#00d4aa",
        background: "#0a0a0f",
        foreground: "#f0f0f5",
        card: "#16161f",
        "card-foreground": "#f0f0f5",
        muted: "#111118",
        "muted-foreground": "#9898a8",
        primary: "#00d4aa",
        "primary-foreground": "#0a0a0f",
        brand: {
          teal: "#00d4aa",
          bg: "#0a0a0f",
          surface: "#111118",
          card: "#16161f",
          border: "#1e1e2e",
          purple: "#7c3aed",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
