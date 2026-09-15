export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pronto: {
          ink: "#1b1917",
          panel: "#24201b",
          line: "#40382e",
          orange: "#f28c00",
          amber: "#ffc400",
          olive: "#81765b",
          cream: "#f5efe4",
          muted: "#b7ad9c"
        }
      },
      fontFamily: {
        sans: ["Alegreya Sans", "Inter", "Segoe UI", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 22px 70px rgba(242, 140, 0, 0.18)"
      }
    }
  },
  plugins: []
};
