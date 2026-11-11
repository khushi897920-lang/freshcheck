import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0D12",
        surface: "#12151C",
        "surface-border": "#1F2430",
        "text-primary": "#E6E8EE",
        "text-muted": "#8A91A3",
        brand: "#6366F1",
        status: {
          fresh: "#22C55E",
          uncertain: "#F59E0B",
          stale: "#EF4444",
          skipped: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
