import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/", // Importante para Vercel
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
  }
})
