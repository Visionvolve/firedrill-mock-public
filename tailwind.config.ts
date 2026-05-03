import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drmax: {
          red: "#46B350",
          redDark: "#358A3F",
          neutralBg: "#F7F7F8",
          textPrimary: "#1A1A1A",
          textMuted: "#6B6B6B",
          border: "#E5E5E5",
          accent: "#FFCC00",
        },
      },
      fontFamily: {
        drmax: ["var(--font-drmax)", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
