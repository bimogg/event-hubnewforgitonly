import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Определяем base path
// Для Vercel используем "/", для GitHub Pages можно указать через VITE_BASE_PATH
const base = process.env.VITE_BASE_PATH || '/';

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
