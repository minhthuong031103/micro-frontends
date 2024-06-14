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
      remotes: {
        product: 'http://localhost:5001/assets/remoteEntry.js',
        // order: 'http://localhost:5002/assets/remoteEntry.js',
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
    // modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
  },
});
