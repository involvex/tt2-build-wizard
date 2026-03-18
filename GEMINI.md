# Project Overview

This is a monorepo named `tt2-build-wizard-monorepo` designed to provide a companion application and tools for the mobile game "Tap Titans 2". The monorepo is structured as follows:

-   **`apps/mobile`**: The main mobile application built with Expo/React Native, utilizing NativeWind for styling and Zustand for state management. It features screens for Dashboard, Artifacts, Raid, Optimizer, Equipment, and Guides, providing game-related information and utilities.
-   **`packages/logic`**: A shared TypeScript package intended for core game-related calculations, data structures, and utility functions that can be consumed by other parts of the monorepo (e.g., the mobile app).
-   **`data/`**: This directory contains various JSON and CSV files storing parsed and organized game data, including guides, tier lists, and reference materials for "Tap Titans 2".

The monorepo uses Bun as its JavaScript runtime and package manager, and it enforces strict code formatting rules through Prettier.

# Building and Running

## Dependencies Installation

To install all monorepo dependencies:

```bash
bun install
```

## Mobile Application (`apps/mobile`)

Navigate to the `apps/mobile` directory for these commands.

-   **Start Android app:**
    ```bash
    bun run android
    # or
    expo start --android
    ```
-   **Start iOS app:**
    ```bash
    bun run ios
    # or
    expo start --ios
    ```
-   **Start web app:**
    ```bash
    bun run web
    # or
    expo start --web
    ```

## Shared Logic Package (`packages/logic`)

Navigate to the `packages/logic` directory for this command.

-   **Build:**
    ```bash
    bun run build
    ```

## Testing

Run tests for the entire monorepo from the root directory:

```bash
bun test
```

## Code Quality and Formatting

-   **Format (from `apps/mobile`):**
    ```bash
    bun run format
    ```
    or from the root:
    ```bash
    prettier --write .
    ```
-   **Lint (from `apps/mobile`):**
    ```bash
    bun run lint
    ```
-   **Lint Fix (from `apps/mobile`):**
    ```bash
    bun run lint:fix
    ```
-   **Type Check (from `apps/mobile`):**
    ```bash
    bun run typecheck
    ```
    or from the root:
    ```bash
    tsc --noEmit
    ```

# Development Conventions

-   **Monorepo Structure**: Standard monorepo setup with `apps/` for applications and `packages/` for shared libraries.
-   **Language**: Primarily TypeScript, with a modern `tsconfig.json` configuration.
-   **Mobile Styling**: Uses NativeWind (Tailwind CSS for React Native) for consistent UI styling.
-   **Mobile State Management**: Leverages Zustand for efficient state management within the mobile application.
-   **Code Formatting**: Strict code formatting is enforced across the repository using Prettier with several specialized plugins.
-   **Linting**: ESLint is configured for maintaining code quality and identifying potential issues.
-   **Runtime/Package Manager**: Bun is the designated JavaScript runtime and package manager for the monorepo.