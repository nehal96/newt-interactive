const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./interactives/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
          500: "#E65B08",
          800: "#311302",
        },
        "evangelion-red": "#9f0000",
        "evangelion-green": "#55eeaa",
      },
      fontFamily: {
        body: ["avenir"],
        title: ["DM Serif Display"],
        logo: ["Righteous"],
        quote: ["Libre Baskerville"],
        evangelion: ["Bebas Neue"],
      },
      maxWidth: {
        prose: "45rem",
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
