import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        halix: {
          void: '#0A0A0F',
          deep: '#12121A',
          card: '#16161F',
          line: '#252532',
          mist: '#8B8BA3',
          glow: '#C4B5FD',
          accent: '#A78BFA',
          core: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        halix: '0 0 40px -10px rgba(167, 139, 250, 0.45)',
        card: '0 25px 50px -12px rgba(0, 0, 0, 0.55)',
      },
      backgroundImage: {
        'halix-radial':
          'radial-gradient(ellipse 80% 60% at 50% -30%, rgba(124, 58, 237, 0.35), transparent 55%)',
        'halix-mesh':
          'linear-gradient(135deg, rgba(18,18,26,0.95) 0%, rgba(10,10,15,1) 50%, rgba(22,16,40,0.9) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
