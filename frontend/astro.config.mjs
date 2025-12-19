import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  srcDir: './src',
  output: 'server', // Cambiado de 'static' a 'server' para que las rutas API funcionen
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    ssr: {
      noExternal: ['@supabase/supabase-js'],
    },
  },
});





