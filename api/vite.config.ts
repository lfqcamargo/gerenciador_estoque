import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: "src",
    workspace: [{ extends: true, test: { name: "unit", dir: "src/domain" } }],
  },
});
