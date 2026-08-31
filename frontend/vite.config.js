import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',  // ← For GitHub Pages relative paths
  base: '/dermacare-ai-by-althexus/',  // ← Your repo name
  build: {
    outDir: 'dist',
  },
})
