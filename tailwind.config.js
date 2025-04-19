/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map your CSS variables to Tailwind colors
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        accent: 'var(--accent-color)',
        border: 'var(--border-color)',
        card: 'var(--card-bg)',
        input: 'var(--input-bg)',
        button: {
          bg: 'var(--button-bg)',
          text: 'var(--button-text)',
        },
        shadow: 'var(--shadow-color)',
      },
      // You can also add these as box-shadow values if needed
      boxShadow: {
        theme: '0 4px 6px var(--shadow-color)',
      },
    },
  },
  plugins: [],
}

