# Hush: Product Requirements Document

| | |
|---|---|
| **Product** | Hush, a personal expense and income tracker |
| **Platform** | Android only (React app, packaged with Capacitor) |
| **Owner** | Gokulakrishnan |
| **Status** | Interactive prototype built; data persistence and Android packaging pending |
| **Prototype** | https://claude.ai/artifact/ThWrrg7PGYwWvCAYUoZLsu |
| **Last updated** | 10 October 2026 |

---

## 1. Summary

Hush is a quiet, professional money tracker for Android. It helps a person record what they spend and earn in a few taps, see where the month is heading, and stay inside a budget. The design takes its cues from Apple's design language: one clear idea per screen, generous space, large numbers and restrained colour.

The name sets the tone. The app should feel calm and never nag.

## 2. Problem and opportunity

Most expense trackers either demand too much effort per entry or bury the answer to "am I okay this month?" under charts. Many are also built around US dollars and categories that don't match everyday life in India (rent, EMIs, UPI payments, festival gifts, SIPs).

Hush aims to be:
- **Fast to log.** An expense takes a few taps, with a custom keypad and category tiles.
- **Clear at a glance.** The Home screen answers how much is spent, how much is left and how much is safe to spend per day.
- **Local to India.** INR only, Indian number grouping (for example ₹1,24,000) and Indian category defaults.

## 3. Goals and non-goals

### Goals
1. Let a user log an expense or income in under 10 seconds.
2. Show monthly position (spent, left, safe per day, balance) on the first screen.
3. Give useful analysis of both income and expenses across week, month and year.
4. Let users set and adjust category budgets and get an early warning when they will overspend.
5. Encourage a daily logging habit with a light streak, without guilt or pressure.
6. Work well on every Android screen size and in light and dark mode.

### Non-goals (for v1)
- Multi-currency support. Hush is INR only.
- Bank or UPI account linking, or automatic SMS reading.
- Shared or family accounts.
- iOS, web or desktop releases.
- Investment portfolio tracking. "Invest" is a spending category and "Investment" an income category, nothing more.
- Notes on expenses (explicitly removed).
- App lock (explicitly removed).

## 4. Target users

| Persona | Description | Main need |
|---|---|---|
| **Salaried professional** | 22 to 40, a fixed salary, rent and EMIs | Know what is left after fixed costs; spot overspending early |
| **Freelancer / side earner** | Irregular income from several sources | See income by source and monthly net savings |
| **Student / early earner** | Small budget, mostly food and travel | A simple way to stay within a monthly limit |

## 5. Design principles

1. **One job per screen.** Each screen has a single dominant element, such as the monthly spend on Home.
2. **Numbers first.** Large, tabular figures with small supporting labels.
3. **Quiet colour.** Neutral surfaces with one green accent. Red is used only for overspending.
4. **Category colour is information.** Each category has its own colour and two-tone icon, used consistently everywhere.
5. **Never block the user.** Deleting is reversible (Undo), and there are no confirmation walls.
6. **Plain language.** Sentence case, active verbs, no jargon. Errors and empty states say what to do next.

## 6. Information architecture

Bottom navigation, left to right: **Home**, **Analytics**, **+ (Add)**, **Budget**, **Profile**.

The + button is raised in the centre and opens the Add sheet from any screen.

## 7. Functional requirements

### 7.1 Home
| ID | Requirement |
|---|---|
| H1 | Greeting by time of day with the user's name. |
| H2 | Streak badge (flame and number) opens the Streak sheet. |
| H3 | Hero card shows the current month's spending, a ring for percent of budget used, a stacked bar of spending by category, and a footer with **Left** (or **Over**), **Today** and **Safe per day**. |
| H4 | The ring and Over label turn red when spending exceeds the total budget. |
| H5 | Summary row shows **Income**, **Expenses** and **Balance** for the current month. |
| H6 | Horizontal Categories strip lists every category with this month's amount, highest first. |
| H7 | **Recent** shows the latest six entries, income and expenses mixed by date. **See all** expands to every entry with a search box (matches title or category). |
| H8 | Tapping any entry opens it for editing. |
| H9 | Expense amounts are shown without a minus sign. Income amounts are green. |

### 7.2 Add and edit sheet
| ID | Requirement |
|---|---|
| A1 | Opens from the + button. An **Expense / Income** switch appears when adding. |
| A2 | Large amount display with an on-screen keypad (digits, decimal point, delete). Up to two decimal places. |
| A3 | Category tiles scroll sideways. Expenses have 15 categories and income has 9 (see 7.7). |
| A4 | A title field ("What was it for?" or "Where is it from?"). If left empty, the category name is used. |
| A5 | Date picker, defaulting to today. Future dates are not allowed. Backdating is allowed. |
| A6 | Save button is disabled until the amount is greater than zero. |
| A7 | When editing, the button reads **Save changes** and a **Delete** button is shown. |
| A8 | Delete shows a toast with **Undo** for about 3.5 seconds. |

### 7.3 Analytics
| ID | Requirement |
|---|---|
| N1 | **Week / Month** toggle. Week covers 7 days and Month covers 4 weeks. |
| N2 | A date-picker button sets the end of the period. A **Today** link resets it. |
| N3 | Summary row for the selected period: Income, Expenses and Saved (or Over). |
| N4 | Bar chart of spending over the period, with the highest bar highlighted. |
| N5 | **Spending split** donut chart with a legend of the top four categories. An empty period shows a ring placeholder and "No spending in this period." |
| N6 | **Income vs expenses** chart: twelve months of the current year as paired bars, with the year's net saved. |
| N7 | **By category** list showing only categories with spending in the period. |

### 7.4 Budget
| ID | Requirement |
|---|---|
| B1 | **Expenses / Income** switch at the top of the screen. |
| B2 | Expenses view shows a **projected month-end spend**, based on the current daily pace, and says whether the user is on track (and by how much) or will go over. |
| B3 | Every category has a monthly limit and a progress bar. The bar turns red when the limit is exceeded. |
| B4 | Tapping a category opens a stepper to raise or lower its limit in ₹500 steps (minimum ₹500). The total budget updates everywhere. |
| B5 | Income view shows income this month, a bar of spending against income, and the amount saved with the savings rate (or how far over). |
| B6 | Income view lists **Sources** (income by category with bars) and **Income entries**, which can be edited or deleted. |

### 7.5 Profile
| ID | Requirement |
|---|---|
| P1 | Avatar with the user's initial, editable name (reflected in the Home greeting). |
| P2 | Stats: expenses logged, current streak, categories used. |
| P3 | **Savings goal** with progress (income minus expenses so far) and a stepper in ₹5,000 steps. Default goal is ₹50,000. |
| P4 | Preferences: **Hide amounts** (replaces every figure with ₹••••) and **Dark appearance**. Daily reminder, Budget alerts and Weekly summary are shown but not yet wired. |
| P5 | Data rows: Currency (INR), Export expenses (CSV) and Backup (Google Drive). Not yet wired. |
| P6 | About: Help and feedback, Privacy policy and Version. |

### 7.6 Streak
- A day counts if at least one **expense** is logged on it.
- The current streak continues while today is still open, and resets after a full day with nothing logged.
- The Streak sheet shows the count, a seven-day flame row, the best streak and days to the next milestone (3, 7, 14, 30, 60 and 100).
- Logging the first expense of a day shows a toast such as "8-day streak! Keep it going."
- The streak card is not on the Home screen. It opens from the flame badge only.

### 7.7 Categories

| Expenses (15) | Income (9) |
|---|---|
| Food, Groceries, Transport, Bills, Rent, EMI, Shopping, Home, Health, Fun, Education, Travel, Gifts, Invest, Other | Salary, Freelance, Business, Interest, Rental, Investment, Bonus, Refund, Misc |

Each category has a unique colour and a two-tone icon on a rounded tile.

## 8. Data model (v1)

**Entry** (expense or income)

| Field | Type | Notes |
|---|---|---|
| id | number | Unique |
| type | `expense` or `income` | Expenses are the default |
| amount | number | INR, up to two decimals, greater than 0 |
| category | string | From the lists in 7.7 |
| title | string | Defaults to the category name |
| date | date | Stored as a calendar date. The prototype stores days-ago offsets |

**Settings:** name, category budgets (map of category to monthly limit), savings goal, appearance, hide-amounts flag.

## 9. Non-functional requirements

- **Responsive.** Works from about 320 px wide upwards. On phones it fills the screen. On tablets and desktops it sits in a centred, phone-sized frame, and in landscape it uses the full width with capped content width.
- **Appearance.** Light and dark themes that follow the system setting, with a manual override.
- **Accessibility.** Visible keyboard focus, labelled icon buttons, text contrast that meets WCAG AA, and reduced-motion support.
- **Performance.** Screens render instantly from local data. Target cold start under 2 seconds on a mid-range device.
- **Privacy.** All data stays on the device in v1. No account is required and no analytics are collected without consent.
- **Locale.** INR symbol and Indian digit grouping everywhere.

## 10. Current status

**Built in the prototype**
- All screens and flows in section 7.
- Sample data, so every screen has something to show.
- Edit, delete and undo; income and expense tracking; date-range analysis; responsive layout.

**Known gaps**
- **No persistence.** Everything resets on reload. This is the top priority.
- **Placeholder history.** The Income vs expenses chart uses sample figures for months before the current one.
- **Unwired controls.** Daily reminder, Budget alerts, Weekly summary, Export and Backup do nothing yet.
- **Sample data depends on today's date.** Some sample entries can fall in the previous month.

## 11. Roadmap

| Phase | Scope |
|---|---|
| **1. Make it real** | Save data on the device (Capacitor storage or SQLite). Remove the sample history. Month-based data model with real dates. |
| **2. Android build** | Wrap with Capacitor, add the app icon and splash screen, test on real devices, build a signed Android App Bundle. |
| **3. Reminders and alerts** | Local notifications for the daily reminder, budget warnings at 80 and 100 percent, and a weekly summary. |
| **4. Data ownership** | CSV export, backup and restore, and an optional Google Drive backup. |
| **5. Smarter tracking** | Recurring entries (rent, EMIs, salary), monthly budget rollover, and custom categories. |

## 12. Success metrics (proposed)

| Metric | Target |
|---|---|
| Time to log one entry | Under 10 seconds (median) |
| Entries logged per active user per week | 10 or more |
| Users who adjust at least one budget limit in week 1 | 50 percent or more |
| Day-7 retention | 30 percent or more |
| Share of active users with a streak of 3 days or more | 40 percent or more |
| Play Store rating | 4.5 or higher |

## 13. Release checklist (Google Play)

- [ ] Data saved on the device and tested across app restarts
- [ ] Signed release build (Android App Bundle) that meets Play's current target API requirement
- [ ] App icon, feature graphic and phone screenshots (light and dark)
- [ ] Short and full store descriptions
- [ ] Privacy policy page, linked from the app and the Play listing
- [ ] Data safety form completed (no data collected or shared in v1)
- [ ] Content rating questionnaire
- [ ] Internal testing, then a closed test, then production rollout

## 14. Open questions

1. Should income entries count toward the daily streak, or expenses only (current behaviour)?
2. Should unspent budget roll over to next month?
3. Is a one-time "Pro" tier planned (for backup, export or custom categories), or should the app stay free and ad-free?
4. Will Hindi and other Indian languages be supported after launch?
5. Should the Android app offer a home-screen widget for quick add?
