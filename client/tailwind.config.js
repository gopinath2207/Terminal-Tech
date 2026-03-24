/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                matrix: {
                    DEFAULT: '#00FF41',
                    dim: '#00CC33',
                    dark: '#006B1C',
                    glow: 'rgba(0,255,65,0.15)',
                },
                surface: {
                    DEFAULT: '#0a0a0a',
                    card: 'rgba(255,255,255,0.04)',
                    border: 'rgba(255,255,255,0.08)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-grid':
                    "linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)",
            },
            backgroundSize: {
                grid: '50px 50px',
            },
            boxShadow: {
                matrix: '0 0 20px rgba(0,255,65,0.15), 0 0 60px rgba(0,255,65,0.05)',
                'matrix-lg': '0 0 40px rgba(0,255,65,0.2), 0 0 100px rgba(0,255,65,0.08)',
                glass: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            },
            animation: {
                'pulse-green': 'pulse-green 2s ease-in-out infinite',
                'fade-up': 'fade-up 0.5s ease forwards',
                shimmer: 'shimmer 1.5s infinite',
            },
            keyframes: {
                'pulse-green': {
                    '0%,100%': { boxShadow: '0 0 20px rgba(0,255,65,0.15)' },
                    '50%': { boxShadow: '0 0 40px rgba(0,255,65,0.35)' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
