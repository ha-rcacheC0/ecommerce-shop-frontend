/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

import daisyui from "daisyui";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themeRoot: ":root",
    themes: [
      {
        dark: {
          "color-scheme": "dark",
          primary: "#002868",
          secondary: "#BF0A30",
          accent: "oklch(74.51% 0.167 183.61)",
          neutral: "#2a323c",
          "neutral-content": "#A6ADBB",
          "base-100": "#1d232a",
          "base-200": "#191e24",
          "base-300": "#15191e",
          "base-content": "#A6ADBB",
        },
      },

      //   dark: {
      //     ...require("daisyui/src/theming/themes")["dark"],
      //     primary: "#002868",
      //     secondary: "#BF0A30",
      //   },
      // },
      // {
      //   light: {
      //     ...require("daisyui/src/theming/themes")["light"],
      //     primary: "#002868",
      //     secondary: "#BF0A30",
      {
        light: {
          "color-scheme": "light",
          primary: "#002868",
          secondary: "#BF0A30",
          "secondary-content": "oklch(98.71% 0.0106 342.55)",
          accent: "oklch(76.76% 0.184 183.61)",
          neutral: "#2B3440",
          "neutral-content": "#D7DDE4",
          "base-100": "oklch(100% 0 0)",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
          "base-content": "#1f2937",
        },
      },
      //   },
      // },
      "coffee",
      "sunset",
      "emerald",
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
  plugins: [daisyui],
};
