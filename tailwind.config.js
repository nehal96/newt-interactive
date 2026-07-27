const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./interactives/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        paper: "#FBFAF7",
        ink: {
          100: "#EEEDF2",
          200: "#DDDCE5",
          300: "#B1AFC0",
          400: "#8B88A0",
          500: "#6A687D", // 5.17:1 on paper
          600: "#58546E",
          700: "#49465D",
          800: "#322F41",
          900: "#1A1825",
        },
        glass: {
          pane: "#EBE9F9",
          edge: "#D3CEEC",
        },
        "newt-blue": {
          50: "#e9f9ff",
          100: "#d5f5ff",
        },
        slate: {
          150: "#e9eef4",
        },
        "evangelion-black": "#030001",
        "evangelion-orange": {
          50: "#fddcc9",
          100: "#faac7d",
          200: "#f99457",
          300: "#f87b31",
          400: "#f76f1e",
          500: "#E65B08",
          800: "#311302",
        },
        "evangelion-red": "#9f0000",
        "evangelion-green": "#55eeaa",
      },
      fontFamily: {
        // `avenir` is a local face, not a webfont — Inter catches the machines
        // that don't have it.
        body: ["avenir", "var(--font-ui)", "sans-serif"],
        ui: [
          "var(--font-ui)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        title: ["var(--font-title)", "Georgia", "serif"],
        logo: ["var(--font-logo)", "system-ui", "sans-serif"],
        quote: ["var(--font-quote)", "Georgia", "serif"],
        evangelion: ["var(--font-evangelion)", "Impact", "sans-serif"],
      },
      maxWidth: {
        prose: "45rem",
        column: "46rem",
      },
      animation: {
        "protein-pulse":
          "protein-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "protein-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          /* Hide scrollbar for IE, Edge and Firefox */
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          /* Hide scrollbar for Chrome, Safari and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
  safelist: [
    "bg-newt-blue-50",
    "bg-newt-blue-100",
    "bg-slate-50",
    "bg-slate-100",
    "bg-indigo-50",
    "bg-indigo-100",
  ],
};
