import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        bg: "#0B1020",
        card: "#141A2A",
        accent: "#1EE0FF",
        accentMuted: "#2ABBD1",
        text: "#EAF2FF",
        textMuted: "#9CB2D1",
        success: "#23D18B",
      },
      boxShadow: {
        glow: "0 0 20px rgba(30,224,255,0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
};
export default config;
