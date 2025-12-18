/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  darkMode: 'class', // Habilitar dark mode con clase
  theme: {
    extend: {
      colors: {
        // Paleta KTM - Dark mode
        ktm: {
          bg: '#0F0F0F',
          surface: '#151515',
          surfaceAlt: '#1C1C1C',
          border: '#2A2A2A',
          text: '#FFFFFF',
          textSecondary: '#E5E5E5',
          textMuted: '#A0A0A0',
          muted: '#A0A0A0',
          accent: '#FF6600',
          accentSoft: '#FF7A1A',
          // Light mode colors
          light: {
            bg: '#FFFFFF',
            surface: '#F8F9FA',
            surfaceAlt: '#F1F3F5',
            border: '#E1E4E8',
            text: '#1A1A1A',
            textSecondary: '#4A4A4A',
            textMuted: '#6B7280',
            muted: '#9CA3AF',
          },
        },
        // Mantener primary y accent para compatibilidad (mapeados a KTM)
        primary: {
          DEFAULT: '#FF6600', // KTM accent
          50: '#FFF4E6',
          100: '#FFE0B3',
          200: '#FFCC80',
          300: '#FFB84D',
          400: '#FFA31A',
          500: '#FF6600',
          600: '#E55A00',
          700: '#CC4D00',
          800: '#B34000',
          900: '#993300',
        },
        accent: {
          DEFAULT: '#FF6600', // KTM accent
          400: '#FF7A1A',
          500: '#FF6600',
          600: '#E55A00',
        },
        dark: {
          DEFAULT: '#0F0F0F', // KTM bg
          50: '#151515', // KTM surface
          100: '#1C1C1C', // KTM surfaceAlt
          200: '#2A2A2A', // KTM border
        },
      },
    },
  },
  plugins: [],
};


