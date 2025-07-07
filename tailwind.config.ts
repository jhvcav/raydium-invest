
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#120E1F",
        foreground: "#F0EFFF",
        primary: {
          DEFAULT: "#9D4EDD",
          foreground: "#FFFFFF",
          50: "#F5F0FF",
          100: "#E9D5FF",
          200: "#D8B4FE",
          300: "#C084FC",
          400: "#A855F7",
          500: "#9D4EDD",
          600: "#7B2CBF",
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#3B0764",
          950: "#1E0A3C",
        },
        secondary: {
          DEFAULT: "#1E1933",
          foreground: "#A39DBC",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#2A2240",
          foreground: "#A39DBC",
        },
        accent: {
          DEFAULT: "#E879F9",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1E1933",
          foreground: "#F0EFFF",
        },
        card: {
          DEFAULT: "#1E1933",
          foreground: "#F0EFFF",
        },
        purple: {
          50: "#F5F0FF",
          100: "#E9D5FF",
          200: "#D8B4FE",
          300: "#C084FC",
          400: "#A855F7",
          500: "#9D4EDD",
          600: "#7B2CBF",
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#3B0764",
          950: "#1E0A3C",
        }
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(157, 78, 221, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(157, 78, 221, 0.5)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "count-up": "count-up 0.8s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "float": "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cosmic-gradient': 'linear-gradient(135deg, #120E1F 0%, #1E1933 25%, #2A2240 50%, #1E1933 75%, #120E1F 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
