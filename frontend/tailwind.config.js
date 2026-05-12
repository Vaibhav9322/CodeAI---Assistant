/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0a0a0f",
          800: "#0f0f1a",
          700: "#13131f",
          600: "#1a1a2e",
          500: "#16213e",
        },
        accent: {
          purple: "#7c3aed",
          blue: "#2563eb",
          cyan: "#06b6d4",
          green: "#10b981",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { transform: "translateX(-10px)", opacity: 0 }, "100%": { transform: "translateX(0)", opacity: 1 } },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
