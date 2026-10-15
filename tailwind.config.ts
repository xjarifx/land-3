import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gov: {
          green: "#006a4e",
          dark: "#004d3a",
          red: "#f42a41",
          cream: "#f5f7f6"
        }
      },
      fontFamily: {
        sans: ["Arial", "Noto Sans Bengali", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
