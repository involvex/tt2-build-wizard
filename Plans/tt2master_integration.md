# Plan: Enhance TT2 Optimizer with TT2Master Functionality

This plan outlines the steps to integrate advanced features from TT2Master into our modern React Native app, preserving the new UI design.

## Core Features to Port

Based on the TT2Master source code and screenshots, we will implement:

1.  **Dashboard:**
    - Import data from clipboard (Save file parsing).
    - Summary widgets (Artifacts count, SP count, BoS %, Raid stats).
    - Quick actions (Art Opt, SP Opt, Profile).

2.  **Artifact Optimizer:**
    - List of artifacts with current level and efficiency.
    - "Optimize" button to calculate upgrades based on % or fixed amounts.
    - Artifact detail view.

3.  **SP Optimizer (Enhancement):**
    - Already started, but needs to be fully aligned with the import data.
    - Skill tree visualization or list view (like the screenshots).

4.  **Equipment/Crafting Advisor:**
    - Recommend equipment sets based on build.
    - Show efficiency of crafting specific pieces.

5.  **Raid Tools:**
    - Clan Raid tracking (attacks, damage).
    - Raid strategies and card setups (using the Reddit guide data we have).

## Technical Implementation

### 1. Save File Parsing (Crucial)

- Port `SaveFile.cs` and `SaveFileReader.cs` logic to TypeScript.
- Create a `SaveFileParser` service in `@tt2-build-wizard/logic`.
- Handle decryption (if needed/possible in JS) or just focus on the clipboard JSON structure.
- **Note:** The C# code uses `SaveFileReader.DecryptSaveFileAsync`. We need to verify if we can replicate the decryption or if we rely on users providing the decrypted JSON from the game's export feature.

### 2. Store Expansion

- Update `useAppStore` to hold the full player profile:
  - Artifacts (levels, owned status).
  - Equipment (owned sets, current gear).
  - Raid stats (card levels).
  - Clan info.

### 3. Navigation Structure

- **Drawer Navigation** (like TT2Master) or **Bottom Tabs** (current).
- _Recommendation:_ Stick to **Bottom Tabs** for primary sections (Dashboard, Optimizer, Raids, Settings) and use **Stacks** for details. It's more modern and fits the current design.

### 4. UI Components (Dark Theme)

- Reuse `Card`, `Button`, `Badge`, `Input`.
- Create `ArtifactCard`, `EquipmentCard`, `RaidCard`.
- Implement the "Grid" layout for the dashboard.

## Step-by-Step Implementation Plan

### Phase 1: Foundation & Dashboard

- [ ] **Fix Dark Mode/Color Scheme:**
  - Update `apps/mobile/tailwind.config.js` to set `darkMode: 'class'` to resolve the "Cannot manually set color scheme" error.
- [ ] **Fix Deprecated SafeAreaView:**
  - Update `apps/mobile/App.tsx` to replace `react-native`'s `SafeAreaView` with `SafeAreaProvider` and `SafeAreaView` from `react-native-safe-area-context`.
- [ ] Implement `SaveFileParser` in `logic` package (focus on JSON clipboard import first).
- [ ] Update `useAppStore` to store player data.
- [ ] Create `DashboardScreen` with summary cards.

### Phase 2: Artifact Optimizer

- [ ] Port `ArtifactOptimization` logic from C# to TS in `logic` package.
- [ ] Create `ArtifactsScreen`.
- [ ] Implement upgrade recommendation UI.

### Phase 3: Equipment & Crafting

- [ ] Port `EquipOptimizer` logic.
- [ ] Create `CraftingScreen`.

### Phase 4: Raids

- [ ] Parse Raid data from save file.
- [ ] Create `RaidsScreen` to show card levels and potential decks (using our Reddit guide data).

## Immediate Action: Fix Color Scheme Error

The error `Cannot manually set color scheme, as dark mode is type 'media'` suggests `nativewind` is trying to toggle a class when the config expects media query behavior.
**Fix:** Update `tailwind.config.js` to use `darkMode: 'class'` or remove the manual toggle if we want system preference. Given the "Dark Theme" requirement, we likely want to force dark mode or control it.

## User Interface "Inspiration"

- **Dashboard:** Grid of stats (Artifacts, SP, BoS).
- **List Views:** Clean rows with icons for Artifacts/Skills.
- **Action Buttons:** Floating Action Button (FAB) or prominent bottom buttons for "Import" and "Optimize".
