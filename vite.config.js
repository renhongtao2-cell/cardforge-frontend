import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND_URL = 'https://cardforge-backend-3.onrender.com'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
