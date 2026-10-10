# Play Store listing

Use this copy in [Google Play Console](https://play.google.com/console). Hush cannot be uploaded from this repo — you sign in and create the app there.

**App name:** Hush  
**Package name:** `com.gokulakrishnxn.hush`  
**Version:** 1.0.0 (versionCode 1)  
**Category:** Finance  
**Privacy policy:** https://gokulakrishnxn.github.io/Hush.app/privacy.html  
**Fallback URL:** https://github.com/Gokulakrishnxn/Hush.app/blob/main/docs/privacy.md

## Short description (80 characters)

Quiet INR expense tracker. See what’s left this month. Data stays on your phone.

## Full description

Hush is a quiet money tracker for everyday spending in India.

Log an expense or income in a few taps. Home shows today’s spend, what is left of this month’s budget, and a safe amount per day. Analytics covers the last week or four weeks. Budget limits move in ₹500 steps.

INR only. Indian number grouping. No ads. No bank or UPI linking. No SMS reading. Your ledger stays on this phone until you export a CSV or delete it.

Made by Gokulakrishnan.

## Data safety

Answer the Play Data safety form as:

- App does **not** collect or share user data with a server
- Data stays on the device
- Optional local sign-in (email or a Google email typed on the phone) is stored on the device only
- Passwords are hashed on the device
- Export CSV is user-initiated and not uploaded by Hush

## Assets you still add in Play Console

- Phone screenshots (at least 2, 16:9 or 9:16)
- Feature graphic 1024 × 500
- High-res icon 512 × 512 (export from the leaf launcher)
- Content rating questionnaire
- Target audience and countries (India first)

## Upload the release

1. Keep `android/hush-release.jks` and `android/keystore.properties` backed up. Losing them means you cannot update the Play listing.
2. From the repo:

```bash
npm run release:aab
```

3. The bundle is `android/app/build/outputs/bundle/release/app-release.aab`.
4. In Play Console: Create app → Testing → Internal testing (or Production) → Create new release → upload the AAB.
5. After each store upload, bump `versionCode` in `android/app/build.gradle`.
