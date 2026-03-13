import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4efe7",
        paper: "#fbf8f3",
        ink: "#1f2a37",
        brand: {
          50: "#eef2f7",
          100: "#dce4ef",
          200: "#bacadd",
          300: "#8da4c5",
          400: "#5b7aa7",
          500: "#38598a",
          600: "#274570",
          700: "#1e375c",
          800: "#172a45",
          900: "#101c30"
        },
        sand: {
          100: "#f7f1e7",
          200: "#ebdfcf",
          300: "#dbc8ad"
        },
        gold: "#b48a56"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16, 28, 48, 0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
