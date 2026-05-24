import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#edf5ff",
          100: "#d8e9ff",
          500: "#1f5f9f",
          700: "#133f68",
          800: "#102f4f",
          900: "#0b1f35",
          950: "#071727"
        },
        amberline: {
          50: "#fff7e6",
          100: "#ffecbf",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309"
        },
        concrete: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          500: "#64748b",
          700: "#334155"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
