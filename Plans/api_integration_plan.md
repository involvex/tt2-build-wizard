# Tap Titans 2 API Integration Plan

This plan outlines the steps to integrate the GameHive Tap Titans 2 API into the mobile application. The goal is to allow users to input their API credentials, fetch their player data, and cache the results for offline use.

## Objectives

1.  **Secure Storage**: Store API Token and Player Token securely (using persisted Zustand store).
2.  **API Client**: Implement a service to fetch data from GameHive's REST API.
3.  **Settings UI**: Create a user-friendly Settings screen for credential management.
4.  **Data Integration**: Fetch, cache, and update player data in the application state.

## 1. State Management (`apps/mobile/src/store/useAppStore.ts`)

We need to extend the existing `useAppStore` to hold the API credentials and manage the data fetching state.

**Changes:**
- Add `apiToken: string | null` to `AppState`.
- Add `playerToken: string | null` to `AppState`.
- Add `lastUpdated: number | null` to `AppState` (timestamp of last successful fetch).
- Add actions:
    - `setApiCredentials(apiToken: string, playerToken: string): void`
    - `setPlayerData(data: any): void` (Update the existing `playerData` or create a new field if the API structure differs significantly from the save file parser).

## 2. API Service (`apps/mobile/src/services/api.ts`)

Create a new service file to handle network requests.

**Features:**
- **Base URL**: `https://tt2-public.gamehivegames.com/`
- **Endpoints**:
    - `GET /player/data`: Fetches player stats, artifacts, etc.
    - `GET /raid/clan_data`: Fetches clan info.
- **Headers**:
    - `API-Token`: User's API Token.
- **Error Handling**: Manage 401 (Unauthorized), 429 (Rate Limit), and 500 errors gracefully.

## 3. Settings Screen (`apps/mobile/src/screens/SettingsScreen.tsx`)

Create a new screen accessible via the app header.

**UI Components:**
- **Inputs**:
    - `API Token`: Text input for the GameHive API Token.
    - `Player Token`: Text input for the Player Token (often required for specific lookups).
- **Actions**:
    - `Save`: Persist tokens to the store.
    - `Refresh Data`: Manually trigger an API call to update player data.
    - `Clear Cache`: specific button to clear stored data.
- **Feedback**:
    - Show "Last Updated" timestamp.
    - Show success/error messages for API tests.

## 4. Application Integration (`apps/mobile/App.tsx`)

Integrate the new screen and logic into the main app flow.

**Changes:**
- **Header**: Add a "Settings" (Gear icon) button next to the Theme Toggle.
- **Navigation**:
    - Update `activeTab` state to include `'settings'`.
    - Render `SettingsScreen` when `activeTab` is `'settings'`.
- **Auto-Refresh (Optional)**: Check `lastUpdated` on app mount and suggest a refresh if data is stale (e.g., > 24 hours).

## Implementation Steps

### Step 1: Update Store
- [ ] Modify `apps/mobile/src/store/useAppStore.ts` to include tokens and actions.

### Step 2: Create API Service
- [ ] Create `apps/mobile/src/services` directory.
- [ ] Create `apps/mobile/src/services/api.ts` with fetch logic.

### Step 3: Create Settings Screen
- [ ] Create `apps/mobile/src/screens/SettingsScreen.tsx`.
- [ ] Implement UI using existing `components/ui.tsx`.
- [ ] Connect to `useAppStore` and `api.ts`.

### Step 4: Update App Navigation
- [ ] Add Settings icon to `App.tsx` header.
- [ ] Add conditional rendering for `SettingsScreen`.

### Step 5: Verification
- [ ] Test entering valid/invalid tokens.
- [ ] Verify data is fetched and stored.
- [ ] Verify data persists after app restart.
