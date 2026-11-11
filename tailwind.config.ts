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
        canvas: "#FFFFFF",
        oat: {
          50: "#FAF8F5",
          100: "#F5F2EC",
          200: "#EFECE6",
          300: "#E3DDD3",
          400: "#D4CAC0",
          500: "#B8AA9D",
          800: "#36332E",
          900: "#1E1C1A",
        },
        panel: {
          light: "#F8FAFD",
          border: "#E2E8F0",
        },
        mist: {
          100: "#EAF0FA",
          200: "#DCE6F5",
          300: "#C9D8EF",
        },
        brand: {
          50: "#EEF2FF",
          500: "#6366F1",
          600: "#4F46E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        'glow-soft': '0 0 25px -5px rgba(99, 102, 241, 0.15)',
        'window': '0 20px 45px -10px rgba(30, 41, 59, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
      }
    },
  },
  plugins: [],
};
export default config;
