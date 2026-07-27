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
        // The site ground: a barely-warm off-white, so the figures are the
        // only saturated thing on a page.
        paper: "#FBFAF7",
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
        body: ["avenir"],
        // The interface sans, distinct from `body` (essay prose) and `title`
        // (display serif): the homepage standfirst and index metadata. Named
        // fallbacks so it degrades to a neutral grotesque, not to Times.
        ui: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Overrides Tailwind's default `font-mono` stack, so code and the
        // index's kind labels are the same mono.
        mono: ["Fira Mono", "ui-monospace", "Menlo", "Consolas", "monospace"],
        title: ["DM Serif Display"],
        logo: ["Righteous"],
        quote: ["Libre Baskerville"],
        evangelion: ["Bebas Neue"],
      },
      maxWidth: {
        prose: "45rem",
        // The homepage/header column. Narrower than the old 64rem card grid —
        // the sparse index reads as composed rather than adrift.
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
