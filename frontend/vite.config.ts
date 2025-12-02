import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Определяем base path для GitHub Pages
// Если репозиторий называется eventhub-clean, то base будет /eventhub-clean/
// Если это корневой репозиторий пользователя, то base будет /
const base = process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/eventhub-clean/' : '/');

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
