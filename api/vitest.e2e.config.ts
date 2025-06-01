import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["src/**/*.e2e-spec.ts"],
    setupFiles: ["./test/setup-e2e.ts"],
    environment: "node",
    globals: true,
    environmentOptions: {
      env: {
        NODE_ENV: "test",
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      test: resolve(__dirname, "./test"),
    },
  },
});
