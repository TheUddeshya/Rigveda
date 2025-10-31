/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables so theme switching via the `.dark` class works at runtime.
        // The actual values live in `src/styles/tokens.css` (light defaults + .dark overrides).
        vedic: {
          // Use rgb(...) with the RGB CSS variables so Tailwind's opacity modifiers
          // (e.g. `bg-vedic-ui/95`) produce valid CSS: `rgb(var(--...-rgb) / <alpha>)`.
          bg: 'rgb(var(--color-vedic-bg-rgb) / <alpha-value>)',
          text: 'rgb(var(--color-vedic-text-rgb) / <alpha-value>)',
          ui: 'rgb(var(--color-vedic-ui-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-vedic-accent-rgb) / <alpha-value>)',
          // Additional semantic colors
          sage: 'rgb(var(--color-vedic-sage-rgb) / <alpha-value>)',
          cream: 'rgb(var(--color-vedic-cream-rgb) / <alpha-value>)',
          slate: 'rgb(var(--color-vedic-slate-rgb) / <alpha-value>)',
          charcoal: 'rgb(var(--color-vedic-charcoal-rgb) / <alpha-value>)',
          // Deity-specific colors for Learn page
          agni: '#D97706',      // amber-600 - fire
          gold: '#F59E0B',      // amber-500 - golden
          soma: '#8B5CF6',      // violet-500 - mystical
          ushas: '#EC4899',     // pink-500 - dawn
        },
        // shadcn/ui compatible tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sanskrit: ['Noto Serif Devanagari', 'serif'],
        transliteration: ['Gentium Plus', 'serif'],
        reading: ['Crimson Pro', 'serif'],
        ui: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
