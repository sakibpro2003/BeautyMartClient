import { type Config } from "tailwindcss";
import daisyui from "daisyui";
// @import "tailwindcss";
// @plugin "daisyui";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        'primary-btn': '#000000',
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], 
  },
};

export default config;
