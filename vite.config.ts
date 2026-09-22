import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  define: {
    "import.meta.env.VITE_ENABLE_MOCKS": JSON.stringify(process.env.VITE_ENABLE_MOCKS ?? "true"),
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/mocks/**", "src/test/**", "src/components/ui/**"],
      thresholds: { statements: 70, lines: 70 },
    },
  },
});
