import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  srcDir: './src',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
});





