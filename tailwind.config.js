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
        // The homepage's greys. Not a stock ramp: every stop is the same
        // desaturated indigo (h 248°, s 11–24%), so the neutrals read as a
        // quiet cousin of the accent instead of as default blue-grey. Tailwind
        // `slate` is cast bluer than the paper it sits on, which is what made
        // subtitles look faintly wrong at 15px.
        //
        // 900 titles · 600 archive titles · 500 subtitles and labels ·
        // 400 dates · 200 hairlines. Keep them moving together — warming one
        // and leaving its neighbours slate just relocates the mismatch.
        ink: {
          100: "#EEEDF2",
          200: "#DDDCE5",
          300: "#B1AFC0",
          400: "#8B88A0",
          500: "#6A687D", // the subtitle grey — 5.17:1 on paper
          600: "#58546E",
          700: "#49465D",
          800: "#322F41",
          900: "#1A1825",
        },
        // The navbar's frosted pane — the `ink` hue carried at a saturation the
        // ramp itself never reaches.
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
      // The webfonts are loaded in lib/fonts.ts and reach here as CSS
      // variables, set on <html> by pages/_document.tsx. They have to: next/font
      // hashes every family name, so naming a family here would match nothing.
      // What's inside the variable is already two deep — the real face, then
      // next/font's size-adjusted local fallback for the moment before the
      // woff2 lands — so the names after it are only for a failed fetch.
      fontFamily: {
        // Essay prose. The head of this stack isn't a webfont — `avenir` is
        // whatever the machine has, which is Avenir on a Mac and nothing at
        // all anywhere else. Inter catches that fall: it's self-hosted and
        // already preloaded for `ui`, so the machines that don't have Avenir
        // get the site's own sans rather than the browser default serif.
        body: ["avenir", "var(--font-ui)", "sans-serif"],
        // The interface sans, distinct from `body` (essay prose) and `title`
        // (display serif): the homepage standfirst and index metadata. Named
        // fallbacks so it degrades to a neutral grotesque, not to Times.
        ui: [
          "var(--font-ui)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        // Overrides Tailwind's default `font-mono` stack, so code and the
        // index's kind labels are the same mono.
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
