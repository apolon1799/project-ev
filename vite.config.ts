import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/project-ev/',
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  define: {
    global: 'globalThis',
  },
})
