import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,       // Default Vite port
    strictPort: false, // Allow fallback ports if 5173 is busy
    open: true,       // Auto-open browser
    cors: true,       // Enable CORS for all requests
    hmr: {
      clientPort: 5173, // Force HMR websocket to use this port
      overlay: true,    // Show errors as overlay
    }
  }
})