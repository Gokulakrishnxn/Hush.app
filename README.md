# Hush

A quiet personal expense and income tracker for Android.

Hush answers one question on the first screen: *am I okay this month?* Log a payment in a few taps, see what is left, and stay inside a budget. It is built for everyday money in India — rent, EMIs, UPI, SIPs, festival gifts — and it never nags.

**INR only.** Indian number grouping (`₹1,24,000`). All data stays on the device.

[Product requirements](./PRD.md) · [Privacy policy](./docs/privacy.md) · [Play Store listing](./docs/PLAY_STORE.md) · [Repository](https://github.com/Gokulakrishnxn/Hush.app)

---

## Features

| Screen | What it does |
|---|---|
| **Welcome** | Local sign-up, email sign-in, or Continue with Google (email stays on this phone) |
| **Home** | Today’s spend, budget ring, left / month / safe per day, income vs expenses, category strip, recent entries |
| **Add** | Expense or income, custom keypad, category tiles, title, date. Save stays off until the amount is more than zero |
| **Analytics** | Week or 4-week view, tappable bars, spending split, income vs expenses for the year |
| **Budget** | Month calendar, per-category limits in ₹500 steps, income sources and savings rate |
| **Profile** | Name, savings goal, hide amounts, light / dark, data control, help and privacy |
| **Streak** | A light daily habit. A day counts when at least one expense is logged |

**Data control** — manage what is on the phone, export a CSV (month, all time, or a date range), delete all money data, or reset one day. Delete and an empty-month reset also clear leftover budget so Left and Safe per day go back to zero.

---

## Design

1. One job per screen.
2. Numbers first — large tabular figures, small labels.
3. Quiet colour. One green accent. Red only for overspending.
4. Category colour is information, used the same way everywhere.
5. Plain language. Sentence case. Empty states say what to do next.

On a phone the app fills the screen. On a tablet or desktop it sits in a centred phone frame.

---

## Stack

| Layer | Choice |
|---|---|
| UI | React 18, TypeScript, Vite |
| Android | Capacitor 7 |
| Persistence | `localStorage` on web, `@capacitor/preferences` on device |
| Tests | Vitest, against domain modules |

No cloud account. No ads. No network calls for money data.

**App id:** `com.gokulakrishnxn.hush`  
**Version:** 1.0.0

---

## Getting started

Requires Node.js 20 or later.

```bash
git clone https://github.com/Gokulakrishnxn/Hush.app.git
cd Hush.app
npm install
npm test
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm test` | Domain tests |
| `npm run build` | Type-check and production bundle |
| `npm run cap:sync` | Build the web app and sync Android |
| `npm run release:aab` | Signed Play Store Android App Bundle |

Hush does not need a `.env` file. See `.env.example`.

---

## Android and Play Store

Debug install on a USB phone:

```bash
npm run cap:sync
cd android && ./gradlew installDebug
```

Release bundle for Play Console:

1. Copy `android/keystore.properties.example` to `android/keystore.properties` and point it at your upload keystore. Back up that keystore — you cannot update the listing without it.
2. `npm run release:aab`
3. Upload `android/app/build/outputs/bundle/release/app-release.aab`
4. Paste the [privacy policy](https://gokulakrishnxn.github.io/Hush.app/privacy.html) URL into Play Console.

Listing copy, Data safety answers, and the asset checklist are in [docs/PLAY_STORE.md](./docs/PLAY_STORE.md).

---

## Data and privacy

Hush stores entries, budgets, preferences and a local sign-in on the device only.

v1 does **not** include bank or UPI linking, SMS reading, cloud sync, or third-party analytics.

---

## License

Private. All rights reserved. Owned by Gokulakrishnan.
