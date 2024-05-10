import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: "v8",
    },
    globalSetup: ["./specs/global-e2e-setup.ts"],
    testNamePattern: "e2e.spec.ts",
  },
});
