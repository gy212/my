/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./stitch_portfolio_home_avant_garde_wireframe/combined_portfolio.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#06f906",
        secondary: "#ff00ff",
        "background-light": "#f0f0f0",
        "background-dark": "#050a05",
        "surface-dark": "#0f230f",
      },
      fontFamily: {
        display: ["'Press Start 2P'", "'PixelChinese'", "'Zpix'", "cursive"],
        body: ["'VT323'", "'PixelChinese'", "'Zpix'", "monospace"],
        tech: ["'Silkscreen'", "'PixelChinese'", "'Zpix'", "cursive"],
      },
      borderRadius: {
        DEFAULT: "0",
        lg: "0",
        xl: "0",
        full: "0",
      },
      backgroundImage: {
        dither:
          "radial-gradient(#06f906 1px, transparent 1px), radial-gradient(#06f906 1px, transparent 1px)",
        "grid-pattern":
          "linear-gradient(to right, #06f906 1px, transparent 1px), linear-gradient(to bottom, #06f906 1px, transparent 1px)",
        "dither-pattern": "radial-gradient(#06f906 1px, transparent 0)",
      },
      backgroundSize: {
        "dither-sm": "4px 4px",
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        "marquee-fast": "marquee 10s linear infinite",
        float: "float 3s ease-in-out infinite",
        glitch: "glitch 1s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-4px, 4px)" },
          "40%": { transform: "translate(-4px, -4px)" },
          "60%": { transform: "translate(4px, 4px)" },
          "80%": { transform: "translate(4px, -4px)" },
          "100%": { transform: "translate(0)" },
        },
      },
    },
  },
  plugins: [],
};
