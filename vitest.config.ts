import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ... Specify options here.
    environment: "jsdom",
    watch: false,
    coverage: {
      provider: "istanbul",
      enabled: true,
      thresholds: {
        lines: 80, // 设置覆盖率阈值（即使未达标仍生成报告）
      },
    },
    globals: true,
    silent: true,
    passWithNoTests: true,
    bail: 0,
  },
});
