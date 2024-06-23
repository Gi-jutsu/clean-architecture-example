import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: "v8",
    },
    exclude: ["build", "node_modules"],
    include: ["src/**/*.e2e.spec.ts"],
  },
});
