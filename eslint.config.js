import pluginVue from "eslint-plugin-vue"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import pluginVitest from "@vitest/eslint-plugin"
import pluginPlaywright from "eslint-plugin-playwright"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"
import eslintPluginReadableTailwind from "eslint-plugin-readable-tailwind"
import eslintParserVue from "vue-eslint-parser"

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },
  skipFormatting,

  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: eslintParserVue,
    },
  },

  // Adding readable-tailwind plugin configuration
  {
    plugins: {
      "readable-tailwind": eslintPluginReadableTailwind,
    },
    rules: {
      // enable all recommended rules to warn
      ...eslintPluginReadableTailwind.configs.warning.rules,
      // enable all recommended rules to error
      ...eslintPluginReadableTailwind.configs.error.rules,

      // or configure rules individually
      "readable-tailwind/multiline": ["warn", { printWidth: 100 }],
    },
  },
]
