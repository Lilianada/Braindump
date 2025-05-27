
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
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      // For example, if you don't want to polyfill 'fs', add 'fs: false'
      // However, for globSync and fs.readFileSync to work, we need them.
      protocolImports: true, // Recommended for full compatibility
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // build: { // Optional: If issues persist with specific modules during build
  //   rollupOptions: {
  //     plugins: [
  //       // Some polyfills might need to be explicitly managed here for build if issues persist
  //     ],
  //   },
  // },
}));

