import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B01",
          foreground: "#FFFFFF",
          hover: "#FF8533",
        },
        background: {
          DEFAULT: "#050719",
          lighter: "#1F1F1F",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
        },
        card: {
          DEFAULT: "#1F1F1F",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#4B5563",
          foreground: "#9CA3AF",
        },
        popover: {
          DEFAULT: "#1F1F1F",
          foreground: "#FFFFFF",
        },
        border: "#4B5563",
        input: "#1F1F1F",
        ring: "#FF6B01",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        button: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "button-press": "button-press 0.2s ease-in-out",
      },
      keyframes: {
        "button-press": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(0.98)",
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
