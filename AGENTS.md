## Commands
- `pnpm dev` — Vite dev server on `localhost:5173`
- `pnpm build` — runs `type-check` + `build-only` in parallel (uses `run-p`)
- `pnpm preview` — preview production build
- `pnpm type-check` — `vue-tsc --build --force`
- `pnpm lint` — `eslint src/ --fix`
- `pnpm test:unit` — `vitest --coverage --run` (jsdom, glob `src/**/*.spec.ts`)
- `pnpm test:e2e` — `playwright test` (tests in `src/tests/e2e/`)
- `pnpm local:ci` — `vitest --run && playwright test && eslint src/ --fix && vue-tsc --build && vite build` (full local CI)

## Architecture
Single-page PWA markdown editor. Not a monorepo (pnpm-workspace.yaml is single-package). No routing — one view with split editor/preview.

### Entry & structure
- Entry: `src/main.ts` — sets up Pinia, Vue Toastification (bottom-right, 2.5s), PWA service worker (auto-update), theme init, mobile warning toast, lazy markdown parser preload
- Root: `src/App.vue` — renders `<PrevueMD />`
- Store: `src/store.ts` — Pinia store, typed with `StoreState/StoreActions/StoreGetters` interfaces
- Components: `src/components/` — `PrevueMD.vue` (layout), `MarkdownEditor.vue`, `MarkdownPreview.vue`, `AppHeader.vue`, `AppFooter.vue`, `IconButton.vue`, `FontSwitcher.vue`
- Composables: `src/composables/` — `useScrollSync` (exported: `{ useScrollSync, ScrollSync }`)
- Utils: `src/utils/` — `lib.ts` (cn, copyToClipboard, downloadMarkdownFile, debounce, warnBeforeUnload), `icons.ts` (inline Primer SVGs via `IconLibrary()`), `markdown-parser.ts`
- Styles: `src/styles/` — `main.css`, `tailwind.css`, `base.css`, `toast.css`

## Testing
- **Unit tests** (Vitest): `src/**/*.spec.ts`. Excludes `e2e/`.
- **Component tests**: `src/components/tests/` — uses `test-utils.ts` helper (`setupTest(Component, mockData, options)`).
- **E2E tests** (Playwright): `src/tests/e2e/`. Dev server auto-starts on `localhost:5173`.
- Unit tests use `vi.mock` for module-level mocking. `clearMocks: true`, `restoreMocks: true` in vitest config.
- Store tests: create Pinia with `setActivePinia(createPinia())` in each `beforeEach`.

## Conventions
- TypeScript-first; small, composable Vue components, logic extracted to composables
- `@/` path alias for `src/` (configured in vite.config.ts and tsconfig)
- `cn()` from `clsx` + `tailwind-merge` for conditional classes
- No inline comments on sensible code; JSDoc on exported functions
- Dark mode via Tailwind `class` strategy, managed through Pinia store + `localStorage`
- Markdown parser: unified + remark-parse + remark-gfm + remark-rehype + rehype-stringify (no `rehype-raw` / dangerous HTML)
- Markdown parse results LRU-cached (10 entries, 750k chars total limit)
- Icons: inline Primer SVGs (`src/utils/icons.ts`), accessed via `IconLibrary(name, size, variant, state)`
- Custom fonts: DM Sans (sans), DM Mono (mono), DM Serif (serif)
- `tailwindcss-motion` plugin for animations; `@tailwindcss/typography` for prose classes
- Security: `allowDangerousHtml: false` in unified pipeline

## Deploy
- CI/CD (`.github/workflows/ci-cd.yml`): pushed to `main` → test → Docker build → push to `gcr.io/prevue-md/prevuemd` → deploy to GCP Cloud Run (`us-central1`)
- Docker (multi-stage): `node:24-alpine` build → `nginx:alpine` serve
- PWA: auto-register service worker via `vite-plugin-pwa`

## PRs & Commits
- Small PRs; update docs when appropriate
- Conventional Commits
- Ensure lint + tests pass before commit
