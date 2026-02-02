import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: "#f6fbf6",
          100: "#e7f5e7",
          200: "#c7e6c8",
          300: "#9fd3a4",
          400: "#6bb97d",
          500: "#459b5d",
          600: "#2f7c45",
          700: "#256039",
          800: "#204d31",
          900: "#1c402a",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 24, 39, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
