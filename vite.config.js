import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Ensure proper base path for deployment
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Set to true if you want source maps in production
  },
  
  // Preview server configuration (for local testing)
  preview: {
    port: 4173,
    host: true,
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
  },
})