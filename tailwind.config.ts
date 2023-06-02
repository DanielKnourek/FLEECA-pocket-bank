import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#39d35f',
        secondary: '#25873d',
      },
      transitionProperty: {
        'height': 'height'
      }
    },
  },
  plugins: [],
} satisfies Config;
