/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',

        'bg-dark': 'var(--bg-dark)',
        'bg-medium': 'var(--bg-medium)',
        'bg-light': 'var(--bg-light)',
        border: 'var(--border)',

        'text-light': 'var(--text-light)',
        'text-muted': 'var(--text-muted)',
        'text-dark': 'var(--text-dark)',
      }
    },
  },
  plugins: [],
}
