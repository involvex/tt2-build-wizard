# TT2-Build-Wizard-Monorepo

This monorepo is designed to be a comprehensive companion for the mobile game "Tap Titans 2". It hosts a suite of applications and tools aimed at assisting players with various aspects of the game, from build optimization to accessing game data and guides.

## Features

-   **Mobile Application (`apps/mobile`):** A cross-platform (iOS, Android, Web) application built with Expo and React Native. It provides:
    -   **Dashboard:** An overview of game-related statistics and progress.
    -   **Artifacts Screen:** Tools and information related to game artifacts.
    -   **Raid Screen:** Resources for clan raids.
    -   **Optimizer Screen:** Helps players optimize their skill point allocations and builds.
    -   **Equipment Screen:** Information and management for in-game equipment.
    -   **Guides Screen:** Access to a curated collection of game guides and strategies.
-   **Shared Logic Package (`packages/logic`):** A TypeScript library containing core game mechanics, calculations, and utility functions, designed to be reusable across different parts of the monorepo.
-   **Game Data (`data/`):** A collection of JSON and CSV files storing parsed and organized data from various community sources (like Reddit wikis), providing up-to-date game information.
-   **Other Projects:** The monorepo also includes related projects such as `TapTitans2AlchemyCalculator` (C#), `TapTitans2Optimiser` (Android), and `tt2-master` (C#), indicating a broader ecosystem of tools around the game.

## Technologies Used

-   **Monorepo Management:** Bun Workspaces
-   **Mobile Development:** Expo, React Native
-   **Styling:** NativeWind (Tailwind CSS for React Native)
-   **State Management:** Zustand
-   **Core Logic:** TypeScript
-   **Package Manager & Runtime:** Bun
-   **Linting:** ESLint (v9 Flat Config)
-   **Formatting:** Prettier
-   **Other:** C# (.NET), Android (Java/Kotlin)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/docs/installation) (v1.3.10 or later recommended)
-   [Node.js](https://nodejs.org/en/download/) (for npx commands if not using bunx)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli` or `bunx expo-cli`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/involvex/tt2-build-wizard.git
    cd tt2-build-wizard
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running the Mobile Application

Navigate to the `apps/mobile` directory to run the mobile application.

```bash
cd apps/mobile
```

-   **For Android:**
    ```bash
    bun run android
    # or
    expo start --android
    ```
-   **For iOS:**
    ```bash
    bun run ios
    # or
    expo start --ios
    ```
-   **For Web:**
    ```bash
    bun run web
    # or
    expo start --web
    ```

### Building Shared Logic

Navigate to the `packages/logic` directory to build the shared logic package.

```bash
cd packages/logic
bun run build
```

## Development

### Testing

Run tests for the entire monorepo from the root directory:

```bash
bun test
```

### Linting

Run ESLint from the root directory to check for code quality and adherence to coding standards:

```bash
npx eslint .
```

### Formatting

To automatically fix formatting issues across the monorepo using Prettier, run from the root directory:

```bash
npx prettier . --write
```
To check for formatting issues without fixing them:
```bash
npx prettier . --check
```
