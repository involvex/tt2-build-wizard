# Plan: Fix Web Support and Metro Config

This plan addresses the missing dependencies for running the Expo app in the browser and confirms the Metro config fix for Windows.

## Objective

Enable `bun run web` to work correctly by installing required packages and ensuring `metro.config.js` uses CommonJS.

## Key Files

- `apps/mobile/package.json`
- `apps/mobile/metro.config.js`

## Implementation Steps

### 1. Install Web Dependencies

Install the missing packages required for React Native Web support:

- `react-dom` (Version matching React)
- `react-native-web`

Command:

```bash
cd apps/mobile
bunx expo install react-dom react-native-web
```

### 2. Verify Metro Config

Ensure `apps/mobile/metro.config.js` is using CommonJS syntax (`require`/`module.exports`) to avoid ESM URL scheme errors on Windows. (This was likely applied in the previous step, but we will confirm/re-apply if needed).

## Verification

- User runs `bun run web` in `apps/mobile`.
- The web server should start without `CommandError` or `ERR_UNSUPPORTED_ESM_URL_SCHEME`.
