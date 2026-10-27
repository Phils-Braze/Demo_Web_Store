/**
 * Local dev server configuration for Google Tag Manager build.
 *
 *   npm run dev:gtm
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      open: "/index.gtm.html",
    },
    define: {
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
