import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "**/e2e/**"],
      include: ["src/**/*.spec.ts"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "dist/", "src/**/*.spec.ts", "*.d.ts", "*.config.*"],
      },
      globals: true,
      clearMocks: true,
      restoreMocks: true
    },
  }),
);
