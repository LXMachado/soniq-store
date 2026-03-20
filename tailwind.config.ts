import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './public/**/*.{html,svg}'],
  theme: {
    extend: {},
  },
} satisfies Config;
