import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',     // Vercel expects this
    rollupOptions: {
      input: './index.html' // Tell Vite where to start
    }
  }
})