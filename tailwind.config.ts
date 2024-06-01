import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      //TEXT
      "text-primary": "var(--white)",
      "text-secondary": "var(--grey-700)",
      "text-tertiary": "var(--grey-400)",
      "text-brand": "var(--orange-500)",

      //BACKGROUND
      "surface-primary": "var(--black-700)",
      "surface-secondary": "var(--grey-200)",
      "surface-tertiary": "var(--grey-700)",
      "surface-brand": "var(--orange-500)",
      "background-hover": "var(--black-500)",
      "nav-button-background-hover": "var(--black-400)",

      //BORDER
      "border-primary": "var(--grey-100)",
      "border-secondary": "var(--grey-400)",
      "border-tertiary": "var(--grey-200)",
    },
  },
  plugins: [],
};
export default config;
