/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
    safelist: [
    "bg-card-c1", "bg-card-c2", "bg-card-c3", "bg-card-c4",
    "border-card-c1b", "border-card-c2b", "border-card-c3b", "border-card-c4b",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: {
          light: "rgba(83, 68, 200, 1)", // ✅ String format
          shadow: "rgba(97, 31, 231, 0.5)", // ✅ String format
          DEFAULT: "rgba(97, 31, 231, 1)", 
        // ✅ String format
        },
        green: {
          600: "#16a34a", // Tailwind's green-600 hex
        },
        dot:"rgba(59, 19, 139, 1)",
        card: {
          c1: "rgba(216, 201, 249, 0.5)",
          c1a: "rgba(97, 31, 231, 0.5)",
          c1b: "rgba(174, 141, 255, 1)",

          c2: "rgba(249, 231, 201, 0.5)",
          c2a: "rgba(231, 161, 31, 0.5)",
          c2b: "rgba(243, 164, 32, 1)",

          c3: "rgba(201, 249, 243, 0.5)",
          c3a: "rgba(31, 231, 161, 0.5)",
          c3b: "rgba(141, 247, 255, 1)",

          c4: "rgba(201, 249, 201, 0.5)",
          c4a: "rgba(31, 231, 31, 0.5)",
          c4b: "rgba(141, 247, 141, 1)",
        },
      },
    },
  },
  plugins: [],
};
