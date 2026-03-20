/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glitch: {
          '0%': { clipPath: 'inset(20% 0 50% 0)' },
          '5%': { clipPath: 'inset(10% 0 60% 0)' },
          '10%': { clipPath: 'inset(15% 0 55% 0)' },
          '15%': { clipPath: 'inset(25% 0 35% 0)' },
          '20%': { clipPath: 'inset(30% 0 40% 0)' },
          '25%': { clipPath: 'inset(40% 0 20% 0)' },
          '30%': { clipPath: 'inset(10% 0 60% 0)' },
          '35%': { clipPath: 'inset(15% 0 55% 0)' },
          '40%': { clipPath: 'inset(25% 0 35% 0)' },
          '45%': { clipPath: 'inset(30% 0 40% 0)' },
          '50%': { clipPath: 'inset(20% 0 50% 0)' },
          '55%': { clipPath: 'inset(10% 0 60% 0)' },
          '60%': { clipPath: 'inset(15% 0 55% 0)' },
          '65%': { clipPath: 'inset(25% 0 35% 0)' },
          '70%': { clipPath: 'inset(30% 0 40% 0)' },
          '75%': { clipPath: 'inset(40% 0 20% 0)' },
          '80%': { clipPath: 'inset(20% 0 50% 0)' },
          '85%': { clipPath: 'inset(10% 0 60% 0)' },
          '90%': { clipPath: 'inset(15% 0 55% 0)' },
          '95%': { clipPath: 'inset(25% 0 35% 0)' },
          '100%': { clipPath: 'inset(30% 0 40% 0)' }
        }
      },
      animation: {
        'glitch-after': 'glitch var(--after-duration) infinite linear alternate-reverse',
        'glitch-before': 'glitch var(--before-duration) infinite linear alternate-reverse'
      },
      colors: {
        primary: '#64ffda',
        slate: "#495670",
        lightest_slate: "#a8b2d1",
        navy:"#0a192f",
        lightest_navy:"#233554",
        off_white:"#e6f1ff",
        light_navy:"#112240",
        page_bg_light: "#f0f4f8"
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', '.light &');
    },
  ],
}