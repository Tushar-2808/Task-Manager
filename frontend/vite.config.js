import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add this server block if it's not there
    proxy: {
      '/api': { // If the request starts with /api
        target: 'http://localhost:5000', // Proxy it to your backend server
        changeOrigin: true, // Needed for virtual hosting
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api prefix on backend
      },
    },
  },
})