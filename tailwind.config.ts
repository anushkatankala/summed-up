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
        border: "hsl(217 32% 17%)",
        input: "hsl(217 32% 17%)",
        ring: "hsl(212 100% 48%)",
        background: "hsl(222 47% 8%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(222 47% 11%)",
        "card-foreground": "hsl(210 40% 98%)",
        muted: "hsl(217 33% 17%)",
        "muted-foreground": "hsl(215 20% 65%)",
        primary: "hsl(213 94% 68%)",
        "primary-foreground": "hsl(222 47% 11%)",
      },
    },
  },
  plugins: [],
};

export default config;
