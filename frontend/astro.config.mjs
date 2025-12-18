import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  srcDir: './src',
  output: 'server',
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js'],
    },
  },
});





