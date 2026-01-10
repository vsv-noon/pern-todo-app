import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.test.js"],
    setupFiles: ["./__tests__/loadEnv.js"],
    exclude: [...configDefaults.exclude],
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude, // Keep Vitest's default exclusions (like node_modules, dist)
      ],
      // enabled: true,
    },
  },
});
