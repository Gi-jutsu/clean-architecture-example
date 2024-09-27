import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite(), swc.rollup()],
  test: {
    exclude: ["build", "node_modules", "src/**/*.e2e.spec.ts"],
    include: ["src/**/*.spec.ts"],
  },
});
