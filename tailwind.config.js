/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        surfaceSubtle: '#27272a',
        border: '#27272a',
        textPrimary: '#fafafa',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        streak: '#fb923c',
        catHealth: '#38bdf8',
        catLearning: '#a78bfa',
        catFitness: '#4ade80',
        catCareer: '#f472b6',
        catMindfulness: '#fbbf24',
      },
    },
  },
  plugins: [],
};

