# Copilot instructions for tt2-build-wizard-monorepo

Purpose: concise guidance for Copilot sessions working in this repository. Focus on commands, high-level architecture, and repository-specific conventions Copilot should use when reading, editing, or running code.

---

## Quick commands (root / workspace)

- Install all JavaScript dependencies (monorepo):
  - bun install

- Run test suite (root):
  - bun test

- Run a single test file (from repo root or package):
  - cd to the package or repo folder and run:
    - bun test path/to/that.test.ts

- Build shared logic package (packages/logic):
  - cd packages/logic && bun run build
  - (produces dist/ and .d.ts declarations)

- Run the mobile app (apps/mobile):
  - cd apps/mobile
  - bun run start           # expo start
  - bun run android         # expo start --android (dev)
  - bun run ios             # expo start --ios (dev)
  - bun run web             # expo start --web

- Formatting, linting, and typecheck (mobile):
  - cd apps/mobile
  - bun run format          # prettier --write .
  - bun run lint            # eslint .
  - bun run lint:fix        # eslint . --fix
  - bun run typecheck       # tsc --noEmit
  - bun run check           # runs format, lint:fix, typecheck and extra expo checks

- Build Android release locally (same steps CI uses):
  - cd apps/mobile
  - bun install
  - npx expo prebuild --platform android
  - cd android && chmod +x gradlew && ./gradlew assembleRelease
  - Requires Java 17 + Android SDK installed locally

- Useful files to open quickly:
  - package.json (root) — workspace config and root scripts
  - packages/logic/package.json — build script
  - apps/mobile/package.json — dev / build / lint scripts and dependencies
  - .github/workflows/android-release.yml — CI release flow
  - README.md (root) — quick start

---

## High-level architecture (big picture)

- Monorepo managed with Bun workspaces (root package.json `workspaces: ["packages/*","apps/*"]`).
- packages/logic: shared TypeScript package intended as the repository's core logic. Built with `bun build` and `tsc` to emit types. Applications consume it using `workspace:*` dependency.
- apps/mobile: Expo-managed React Native application that also targets web via `expo start --web`. Uses NativeWind (tailwind), Zustand for state, and depends on `@tt2-build-wizard/logic`.
- CI: A GitHub Actions workflow (android-release.yml) that installs Bun, builds the logic package, runs Expo prebuild, and then uses Gradle to assemble an Android release APK. That workflow should be treated as the canonical CI build steps for Android release.
- Other directories: Several historical/auxiliary projects (C# tools: TapTitans2AlchemyCalculator, TapTitans2Optimiser, tt2-master). These are present but separate from the Node/Bun workspace.

When reasoning about cross-cutting changes (e.g., API shapes, data formats, package exports), always check packages/logic first and then apps/mobile for consumers.

---

## Key repo conventions and rules (do not assume generic defaults)

- Bun-first workflow: use Bun for install, build, and tests. Avoid mixing npm/yarn invocations in CI scripts unless you explicitly intend to.
- Workspace linking: internal packages are referenced with `workspace:*`. Building or testing a consumer often requires building packages/logic first.
- packages/logic build produces both JS and declaration files (dist/ + .d.ts). Any code changes to exported APIs must update package's public surface and run its build.
- Expo prebuild required for native Android builds: `npx expo prebuild` must be run before invoking Gradle for Android.
- TypeScript: projects target TypeScript 5.x — use `tsc --noEmit` for typechecks. The mobile app uses `tsc` only for type checking (no emit).
- Formatting and linting:
  - Prettier enforced via `@involvex/prettier-config` (root). Use `bun run format` at apps/mobile or run Prettier at root when changing formatting rules.
  - ESLint is configured per-app (apps/mobile). Use the package's lint scripts.
- CI ordering matters: CI builds logic package first, then prepares the mobile app. When running locally mimic that order when producing artifacts used by apps/mobile.
- Keep edits surgical: for packaging or API compatibility changes update both implementation and package export declarations; update README/usage examples if public API changes.

---

## Where Copilot should look first for context

1. apps/mobile/package.json — dev scripts, dependencies, and Expo usage
2. packages/logic/package.json and src/index.ts (or index.ts) — package build, types and public API
3. .github/workflows/android-release.yml — canonical release steps
4. README.md and Plans/ — project-level quick start and planned tasks
5. .gemini/skills/** — repository-provided assistant skills and references (useful for domain-specific tasks like mobile UI patterns or data engineering flows)

When making multi-file edits, gather and present the minimal set of files that are affected and run the unit/build/typecheck commands above to validate.

---

## Quick validation checklist for code changes

- If a package API changed: run `cd packages/logic && bun run build` and then `cd apps/mobile && bun run typecheck`.
- If mobile native code is touched: run `npx expo prebuild` before any Android/iOS native build.
- Run formatter and linter from the relevant package before committing (`bun run format`, `bun run lint:fix`).

---

## Notes for assistant workflows

- Prefer non-destructive edits. When adding or changing public APIs, update package build scripts, types, and README usage examples in the same change.
- When asked to run tests or builds, use `bun` commands and run them in the appropriate package folder (cd first).
- For release-related tasks consult `.github/workflows/android-release.yml` and follow its order: install -> build logic -> java/sdk -> expo prebuild -> gradle assembleRelease.
- If a requested task touches multiple languages (TS and C#), identify the primary target language and ask for confirmation before changing the other projects.

---

## Where to update docs and important files

- If changing public package APIs: update packages/logic/README.md and root README.md where usage examples exist.
- If changing mobile scripts or build steps: update apps/mobile/package.json and, if relevant, .github/workflows/android-release.yml.

---

If you want, Copilot can also add a lightweight CONTRIBUTING.md or a short developer quick-start in apps/mobile/README.md to capture the local dev flow (bun install → build logic → expo start). Ask and it will be created.

---

