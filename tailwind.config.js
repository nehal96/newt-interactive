module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./interactives/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "newt-blue": {
          50: "#e9f9ff",
          100: "#d5f5ff",
        },
      },
      fontFamily: {
        body: ["avenir"],
        title: ["DM Serif Display"],
        logo: ["Righteous"],
      },
    },
  },
  plugins: [],
};
