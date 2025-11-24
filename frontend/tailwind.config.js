/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // UNDRSTND brand colors (dark theme)
        'undrstnd-dark': '#0a0a0a',
        'undrstnd-gray': '#1a1a1a',
        'undrstnd-light': '#f5f5f5',
        'undrstnd-accent': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
        'glow-purple-lg': '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
        'glow-blue-lg': '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 3s linear infinite',
        'fade-in': 'fadeIn 0.7s ease-in-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'glow-move': 'glowMove 8s ease-in-out infinite',
        'glow-breathe-move': 'glowBreatheMove 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        glowMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(10px, -10px) scale(1.1)' },
          '50%': { transform: 'translate(-5px, 5px) scale(0.95)' },
          '75%': { transform: 'translate(-10px, -5px) scale(1.05)' },
        },
        glowBreatheMove: {
          '0%, 100%': { opacity: '0.4', transform: 'translate(0, 0) scale(1)' },
          '16.66%': { opacity: '0.6', transform: 'translate(8px, -8px) scale(1.08)' },
          '33.33%': { opacity: '0.7', transform: 'translate(-4px, 4px) scale(1.02)' },
          '50%': { opacity: '0.65', transform: 'translate(-8px, -4px) scale(1.05)' },
          '66.66%': { opacity: '0.6', transform: 'translate(4px, 8px) scale(1.03)' },
          '83.33%': { opacity: '0.55', transform: 'translate(6px, -6px) scale(1.06)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

