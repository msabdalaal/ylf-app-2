/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      blur: {
        "4xl": "500px",
      },
      // container: {
      //   center: true,
      //   padding: '1rem',
      //   screens: {
      //     sm: '100%',
      //     md: '100%',
      //     lg: '100%',
      //     xl: '100%',
      //     '2xl': '100%',
      //   },
      // },
    },
  },
  plugins: [],
  darkMode: "class",
};
