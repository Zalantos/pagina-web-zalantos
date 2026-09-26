/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B2A3C',
        accent: '#2FBF71',
        neutral: '#6F7A83',
        surface: '#FAFBFC',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Inter Fallback',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Space Grotesk',
          'Space Grotesk Fallback',
          'Inter',
          'Inter Fallback',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
