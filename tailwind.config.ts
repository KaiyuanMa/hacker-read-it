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
      "text-secondary": "var(--grey-400)",

      //BACKGROUND
      "surface-primary": "var(--black-700)",
    },
  },
  plugins: [],
};
export default config;
