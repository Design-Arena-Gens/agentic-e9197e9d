import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        '80s-pink': '#ff6ec7',
        '80s-cyan': '#00ffff',
        '80s-purple': '#9d4edd',
        '80s-orange': '#ff6d00',
      },
    },
  },
  plugins: [],
};
export default config;
