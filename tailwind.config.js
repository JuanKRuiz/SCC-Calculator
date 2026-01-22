/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
           app: 'var(--bg-app)',
           card: 'var(--bg-card)',
           alt: 'var(--bg-card-alt)',
        },
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        brand: {
          blue: 'var(--brand-blue)',
          red: 'var(--brand-red)',
          yellow: 'var(--brand-yellow)',
          green: 'var(--brand-green)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
        border: {
           subtle: 'var(--border-subtle)',
           strong: 'var(--border-strong)',
        }
      }
    },
  },
  plugins: [],
}
