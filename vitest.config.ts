import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      include: ['src/components/tests/*.spec.ts', 'src/tests/ut/*.spec.ts'],
      root: fileURLToPath(new URL("./", import.meta.url)),
    },
  }),
);
