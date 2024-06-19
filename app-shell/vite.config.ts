import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'app_shell',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthContext': './src/AuthContext',
      },
      remotes: {
        // product: 'http://localhost:5001/assets/remoteEntry.js',
        product:
          'https://micro-frontends-products.vercel.app/assets/remoteEntry.js',
        // order: 'http://localhost:5002/assets/remoteEntry.js',
        order: 'https://micro-frontends-orders.app/assets/remoteEntry.js',
      },

      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
