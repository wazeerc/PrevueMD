## AGENTS Guide:
- Follow existing docs/patterns; keep changes minimal.
- No external UI libraries unless specified.
- TypeScript-first; small, composable Vue components, abstract logic into composables.
- Adhere to Vue 3, TypeScript and TailwindCSS best practices.
- JSDoc for exported functions and non-obvious logic, no inline comments.
- Accessible, responsive, testable, scalable UI; reuse Tailwind utilities.

## Commands (pnpm):
- `pnpm dev` `pnpm build` `pnpm preview` `pnpm type-check`
- `pnpm lint` `pnpm test:unit` `pnpm test:e2e`

## Paths:
- Entry: `src/main.ts` Root: `src/App.vue`
- Components: `src/components/` Composables: `src/composables/`
- Utils: `src/utils/` Styles: `src/styles/`
- Tests: `src/tests/ut/`, `src/components/tests/`, `src/tests/e2e/`

## PR & Commits:
- Keep PRs small; update docs when appropriate.
- Ensure lint/tests pass, else adjust accordingly.
- Use Conventional Commits: <https://www.conventionalcommits.org/en/v1.0.0/#specification>