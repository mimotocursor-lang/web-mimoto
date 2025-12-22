import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import path from 'node:path';

export default defineConfig({
  srcDir: './src',
  output: 'server', // Cambiado de 'static' a 'server' para que las rutas API funcionen
  adapter: vercel({
    functionPerRoute: false,
    // Nota: El runtime se especifica en package.json engines
    // Vercel debería detectar automáticamente Node.js 20 desde engines
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





