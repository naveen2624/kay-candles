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
        blush: {
          50: "#fff5f7",
          100: "#ffe4ea",
          200: "#ffc9d5",
          300: "#ffa0b4",
          400: "#ff6b8a",
          500: "#f83b63",
          600: "#e51a47",
          700: "#c1113a",
          800: "#a11236",
          900: "#891333",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        cream: {
          50: "#fefdf8",
          100: "#fdf8ed",
          200: "#faefd4",
          300: "#f5e0a8",
          400: "#efca72",
          500: "#e8b348",
        },
        dusty: {
          pink: "#f2c4ce",
          mauve: "#c9a0b5",
          rose: "#d4849a",
        }
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        accent: ["'Playfair Display'", "Georgia", "serif"],
      },
      backgroundImage: {
        "pink-mesh": "radial-gradient(at 40% 20%, #ffd6df 0px, transparent 50%), radial-gradient(at 80% 0%, #ffe4ea 0px, transparent 50%), radial-gradient(at 0% 50%, #fff0f3 0px, transparent 50%), radial-gradient(at 80% 50%, #ffc9d5 0px, transparent 50%), radial-gradient(at 0% 100%, #fff5f7 0px, transparent 50%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
