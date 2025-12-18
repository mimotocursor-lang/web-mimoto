import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  srcDir: './src',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
  }),
  integrations: [tailwind()],
  server: {
    port: 4321,
  },
});





