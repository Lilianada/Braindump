
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Your Vite dev server port
    proxy: {
      // Proxy /api requests to our Express server running on port 3001
      '/api': {
        target: 'http://localhost:3001', // The port your Express server is listening on
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if your Express server doesn't expect /api prefix
      }
    }
  },
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p)),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
