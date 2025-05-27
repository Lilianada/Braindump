
import { defineConfig, PluginOption } from "vite"; // Added PluginOption for explicit typing if needed, but 'as const' should suffice
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
    // Ensure nodePolyfills runs before other plugins that might interact with module resolution
    // or before Vite's default handling of Node built-ins.
    {
      ...nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        // For example, if you don't want to polyfill 'fs', add 'fs: false'
        // However, for globSync and fs.readFileSync to work, we need them.
        protocolImports: true, // Recommended for full compatibility
      }),
      enforce: 'pre' as const, // Correctly typed 'pre'
    },
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean as <T>(x: T | false | null | undefined) => x is T), // Ensure filter type guard is correct
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

