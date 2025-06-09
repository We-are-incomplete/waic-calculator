/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/waic-calculator/",
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
