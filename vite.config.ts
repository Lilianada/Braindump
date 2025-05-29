
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy /api requests to our Express server running on port 3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
    // Ensure proper fallback for client-side routing
    historyApiFallback: true,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
