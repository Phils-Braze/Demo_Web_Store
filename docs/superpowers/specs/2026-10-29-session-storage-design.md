# Session and storage overhaul

## Goal
Make the demo store behave like a real website for login sessions and profile data:
refresh resumes the last session silently, logout clears the session and client cache, user data lives in a simulated backend.

## Layers
| Layer | Module | Holds | On logout |
|---|---|---|---|
| Client session | `lib/session.ts` | `{userId, sessionId, startedAt}` under `STORAGE.session` | removed |
| Client cache | `ProfileContext` / `CartContext` state | active user's profile and cart | dropped |
| Mock backend | `lib/mockBackend.ts` | profiles, carts, orders, Braze revenue cache, last-sent values, keyed by user ID | kept |
| Device prefs | `lib/storage.ts` helpers | guest dark mode, Braze credentials, SDK prefs | kept |

`lib/storage.ts` is the only code that touches `localStorage`. `lib/storageKeys.ts` is the only place keys are defined.

## Session flow
- Refresh: read session, load profile and cart from backend, no login event.
- Login click: `startSession` creates a new `sessionId`, `loginKind` is `"login"`, one `login` event fires.
- Logout: `endSession`, cache cleared, one `logout` event fires.
- Other tabs: `storage` event syncs session and profile changes. Synced changes have `loginKind` `"restore"`, so they never fire a login event.
- `refreshKey` is removed. Consumers re-run on `sessionId`, which is stable across refresh and changes on each login.
- No session expiry. A session lasts until logout.

## Cart
- Per user, saved to the backend on every change.
- Anonymous cart lives in memory only and merges into the user's cart on an explicit login.

## Migration
`migrateStorage()` runs once before render (schema v2). It turns the legacy `current_user` key into a session, moves the legacy global cart into that user's cart, and deletes both legacy keys. Profiles, purchases, revenue and last-sent keys keep their name and shape.

## Verification
`npm run build` for types, then a browser pass: login, refresh (no `login` in dataLayer), logout, login as another user, two-tab sync, legacy-key migration.
