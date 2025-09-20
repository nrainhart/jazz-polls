import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Configurar la base path para GitHub Pages
  // Cambiar 'jazz-polls' por el nombre de tu repositorio
  base: command === "build" ? "/jazz-polls/" : "/",
}));
