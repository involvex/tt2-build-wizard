# Plan: TT2 Optimizer Web & Mobile App

Design and implement a modern, responsive build optimizer for Tap Titans 2 using the gathered data and logic.

## Objective

Build a cross-platform (Web + Android) application that allows users to import their save data or manually enter stats to receive optimized skill point allocations.

## Tech Stack

- **Monorepo:** Bun Workspaces
- **Frontend/Mobile:** Expo (React Native) + NativeWind (Tailwind CSS)
- **Logic Engine:** TypeScript (using Incremental Efficiency algorithms)
- **Deployment:** GitHub Pages (Web) + GitHub Actions for Android APK builds.

## Implementation Phases

### Phase 1: Core Logic Engine

- [ ] Create a `logic` package.
- [ ] Parse `skills.js` and `reductions.js` into typed TypeScript objects.
- [ ] Implement the `OptimizerEngine` class:
  - Input: Build Type (e.g., Clan Ship), Gold Source (e.g., Fairy), Total SP.
  - Output: Optimized skill list.
- [ ] Unit tests for formulas.

### Phase 2: Web/Mobile UI (Expo)

- [ ] Initialize Expo project with Web support.
- [ ] Design responsive Layout:
  - Desktop: Multi-column dashboard.
  - Mobile: Bottom-tab navigation or swipeable cards.
- [ ] Build key screens:
  - **Dashboard:** Overview of current stats.
  - **Optimizer:** The main tool with "Calculate" action.
  - **Guide Reader:** View the collected Reddit guides in a clean UI.
  - **Settings:** App configurations.

### Phase 3: Data Integration & Persistence

- [ ] Implement local storage for user stats (Zustand + Persist).
- [ ] Add "Export/Import" feature for save data strings (referencing TT2Master logic).

### Phase 4: CI/CD & Deployment

- [ ] GitHub Workflow for Web deployment.
- [ ] GitHub Workflow for EAS (Expo Application Services) or local Android builds.

## Verification & Testing

- Compare optimizer results with the TT2 Compendium spreadsheets to ensure accuracy.
- Verify responsiveness on mobile browsers and simulators.
