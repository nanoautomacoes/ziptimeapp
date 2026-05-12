import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: 'all',
    hmr: { clientPort: 443 },
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'X-Frame-Options': 'ALLOWALL'
    }
  }
})