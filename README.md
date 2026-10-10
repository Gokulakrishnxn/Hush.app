# Hush

A quiet personal expense and income tracker for Android. Built as a React app and packaged with Capacitor.

Hush is INR-only. It answers how the month is going on the first screen, and keeps logging an expense to a few taps.

## Stack

- React 18 + TypeScript + Vite
- Capacitor 7 for the Android shell
- Local persistence (`localStorage` on web, Preferences on device)

## Project layout

```
src/
  domain/     money, dates, categories, streak, ledger, analytics
  data/       persistence seam and seed data
  features/   Home, Analytics, Budget, Profile, Add, Streak
  ui/         shared chrome and design primitives
  styles/     tokens and layout from the Hush design
```

Domain modules own the rules. Screens only render.

## Develop

```bash
npm install
npm test
npm run dev
```

Open the local Vite URL. On a wide window the UI sits in a phone frame.

## Android

```bash
npm run cap:sync
npx cap open android
```

Then run from Android Studio. App id: `com.gokulakrishnxn.hush`.

## Product notes

See `PRD.md` for requirements, the v1 data model, and the Play release checklist.
