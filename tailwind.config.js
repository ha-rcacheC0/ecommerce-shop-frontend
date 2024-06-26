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
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#002868",
          secondary: "#BF0A30",
        },
      },
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#002868",
          secondary: "#BF0A30",
        },
      },
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
