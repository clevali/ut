/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // ... Specify options here.
    watch: false,
    coverage: {
      provider: "istanbul",
      enabled: true,
    },
    globals: true,
  },
});
