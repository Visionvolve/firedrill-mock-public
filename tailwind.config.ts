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
          red: "#E4002B",
          redDark: "#AF0023",
          green: "#78BE20",
          greenDark: "#47850A",
          greenSuccess: "#3C911E",
          neutralBg: "#F7F7F8",
          surfaceBg: "#FFFFFF",
          textPrimary: "#1B1B1B",
          textMuted: "#5E5E5E",
          textSubtle: "#7A7A7A",
          border: "#DCDCDC",
          loyaltyBlue: "#09629D",
          infoBg: "#E5F1FE",
          accent: "#FFE500",
        },
      },
      fontFamily: {
        drmax: ["var(--font-drmax)", "Mulish", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
