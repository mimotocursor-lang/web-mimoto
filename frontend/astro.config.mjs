import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import path from 'node:path';

export default defineConfig({
  srcDir: './src',
  output: 'server', // Cambiado de 'static' a 'server' para que las rutas API funcionen
  adapter: vercel({
    functionPerRoute: false,
    // El runtime se especifica en vercel.json
  }), // Adaptador de Vercel para serverless functions
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    ssr: {
      noExternal: ['@supabase/supabase-js'],
    },
    optimizeDeps: {
      exclude: ['@supabase/supabase-js'],
    },
  },
});





