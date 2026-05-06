import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.BASE_URL || '',
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      host: 'localhost',
    },
  },
});
