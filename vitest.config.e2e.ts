import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite(), swc.rollup()],
  test: {
    coverage: {
      enabled: true,
      include: ["src/**/*.ts"],
      provider: "v8",
    },
    fileParallelism: false,
    exclude: ["build", "node_modules"],
    include: ["src/**/*.e2e.spec.ts"],
  },
});
