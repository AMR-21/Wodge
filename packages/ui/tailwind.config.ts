import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          base: "rgb(var(--primary-base))",
          muted: "rgb(var(--primary-muted))",
          "muted-foreground": "rgb(var(--primary-muted-foreground))",
          "muted-icon": "rgb(var(--primary-muted-icon-foreground))",
        },
        neutral: {
          DEFAULT: "rgb(var(--neutral))",
          foreground: "rgb(var(--neutral-foreground))",
          muted: "rgb(var(--neutral-muted))",
          "muted-foreground": "rgb(var(--neutral-muted-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
          base: "rgb(var(--destructive-base))",
          muted: "rgb(var(--destructive-muted))",
          "muted-foreground": "rgb(var(--destructive-muted-foreground))",
        },
        warning: {
          DEFAULT: "rgb(var(--warning))",
          foreground: "rgb(var(--warning-foreground))",
          base: "rgb(var(--warning-base))",
          muted: "rgb(var(--warning-muted))",
          "muted-foreground": "rgb(var(--warning-muted-foreground))",
        },
        success: {
          DEFAULT: "rgb(var(--success))",
          foreground: "rgb(var(--success-foreground))",
          base: "rgb(var(--success-base))",
          muted: "rgb(var(--success-muted))",
          "muted-foreground": "rgb(var(--success-muted-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        surface: {
          DEFAULT: "rgb(var(--surface))",
          foreground: "rgb(var(--surface-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--surface)/0.7)",
          foreground: "rgb(var(--surface-foreground))",
        },
        page: {
          DEFAULT: "rgb(var(--surface)/0.3)",
          foreground: "rgb(var(--surface-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
