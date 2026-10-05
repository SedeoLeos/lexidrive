/**
 * LexiDrive — "Modern Luxury Minimalism" design tokens.
 * Signature blue #3d469D, warm off-whites, near-imperceptible greys.
 * Hierarchy is expressed through background tints only (no shadows, no heavy borders).
 * Keep in sync with src/core/theme/colors.ts (used where a raw value is required).
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3D469D',
          deep: '#2E3578',
          soft: '#6C73B8',
          mist: '#E9EAF4',
          haze: '#F2F2F8',
          veil: '#EBECF5',
        },
        canvas: '#FAF9F6',
        surface: {
          DEFAULT: '#F4F3EF',
          raised: '#EFEEEA',
          sunk: '#F7F6F2',
        },
        ink: {
          DEFAULT: '#1F2133',
          soft: '#4A4C5C',
          muted: '#8A8B96',
          faint: '#B9BAC2',
        },
        success: { DEFAULT: '#4F7A64', mist: '#EAF1EC' },
        danger: { DEFAULT: '#A65A5A', mist: '#F6ECEC' },
      },
      fontFamily: {
        thin: ['Inter_200ExtraLight'],
        light: ['Inter_300Light'],
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
      },
      letterSpacing: {
        luxe: '0.18em',
      },
    },
  },
  plugins: [],
};
