import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  srcDir: './src',
  output: 'hybrid',
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
});





