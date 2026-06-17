import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "istanbul",
    },
    exclude: ["node_modules", ".next"],
  },
  plugins: [tsconfigPaths()],
});
