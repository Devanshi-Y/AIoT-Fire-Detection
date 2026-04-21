export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#22c55e",
        danger: "#ef4444",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  extend: {
    colors: {
      primary: "#f97316", // orange
      secondary: "#fed7aa", // light orange
      warning: "#facc15", // yellow
      danger: "#ef4444", // red
      safe: "#22c55e", // green
      bg: "#fff7ed", // warm light bg
    },
  },
};
