import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0B1120',
        'bg': '#0F172A',
        'surface': '#1E293B',
        'surface-2': '#243349',
        'border-soft': '#1f2b3e',
        'text-muted': '#CBD5E1',
        'text-meta': '#64748B',
        'text-dim': '#475569',
        'accent': '#F97316',
        'cool': '#38BDF8',
        'price-up': '#F87171',
        'price-down': '#34D399',
        'warn': '#FBBF24',
      },
    },
  },
  plugins: [],
}

export default config
