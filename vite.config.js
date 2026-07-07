import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: !isProduction,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      "/api": {
        target: isProduction ? process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY || ''),
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'),
  },
})