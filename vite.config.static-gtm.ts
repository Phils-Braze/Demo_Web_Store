/**
 * Production single-file bundle with Google Tag Manager and Braze SDK removed.
 *
 *   npm run build:static-gtm
 *
 * Output: ./static-html-site-gtm/index.html — open directly in any browser (file://)
 * or serve on any static hosting environment.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), viteSingleFile()],
    base: "./",
    build: {
      outDir: "static-html-site-gtm",
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "index.gtm.html"),
      },
    },
    define: {
      "import.meta.env.VITE_HASH_ROUTER": JSON.stringify("true"),
      "import.meta.env.VITE_APP_MODE": JSON.stringify("gtm"),
      "import.meta.env.VITE_GTM_CONTAINER_ID": JSON.stringify("GTM-57Q85TXB"),
    },
    resolve: {
      alias: {
        "@braze/web-sdk": path.resolve(__dirname, "src/lib/gtm/brazeShim.ts"),
      },
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["@braze/web-sdk"],
    },
  };
});
