import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js', // default file name
      exposes: {
        './Product': './src/Product',
        './ProductDetail': './src/ProductDetail',
      },
      remotes: {
        app_shell:
          'https://micro-frontends-app-shell.vercel.app/assets/remoteEntry.js',

        // https://micro-frontends-products.vercel.app/assets/remoteEntry.js
        // // app_shell: 'http://localhost:4000/assets/remoteEntry.js',
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
    cssCodeSplit: true,
  },
});
