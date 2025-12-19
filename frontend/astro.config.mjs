import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  srcDir: './src',
  output: 'server', // Cambiado de 'static' a 'server' para que las rutas API funcionen
  adapter: vercel(), // Adaptador de Vercel para serverless functions
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





