import { Sheet } from '@/ui/Sheet';

interface Section {
  heading: string;
  body: string[];
}

const COPY: Record<
  'help' | 'privacy',
  { title: string; lead: string; sections: Section[] }
> = {
  help: {
    title: 'Help and feedback',
    lead: 'Hush is a quiet money tracker for this phone. INR only. A few taps to log, then a clear view of the month.',
    sections: [
      {
        heading: 'Log an expense or income',
        body: [
          'Tap + from any screen. Choose Expense or Income, enter the amount on the keypad, pick a category, and add a title if you want. Save stays off until the amount is more than zero.',
          'Tap a row on Home or Budget to edit it. Delete shows Undo for a few seconds. There is no confirmation wall.',
        ],
      },
      {
        heading: 'Home',
        body: [
          'The large number is today\'s spending. The ring is how much of this month\'s budget you have used.',
          'Left is what remains of your category budgets this month. If you have gone past the budget, it says Over. The middle figure is this month\'s total spend. Safe per day is Left divided by the days still left in the month, including today.',
          'Income, Expenses and Balance below the card are for the current month. The flame opens your streak.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'Week is the last 7 days. Month is the last 4 weeks. The date chip sets the end of that window. Today resets it.',
          'Tap a bar to see that day or week\'s spend. Spending split and By category use the same period. Income vs expenses looks across this calendar year.',
        ],
      },
      {
        heading: 'Budget',
        body: [
          'Each expense category has a monthly limit. Tap a category, then use + or − to change it in ₹500 steps. The date chip lets you look at a past month.',
          'Switch to Income to see sources and the savings rate for that month.',
        ],
      },
      {
        heading: 'Profile',
        body: [
          'The first screen asks your name. You can change it here. Set a savings goal, and turn Hide amounts or Dark appearance on. Daily reminder, Budget alerts and Weekly summary stay on this device.',
          'Data control lets you see what is on the phone, export a spreadsheet, reset one day, or delete every expense and income. Delete and an empty-month reset also clear leftover budget, so Left and Safe per day go back to zero.',
        ],
      },
      {
        heading: 'Streak',
        body: [
          'A day counts when you log at least one expense. Miss a full day and the streak resets. No lockouts, no guilt — just a light habit.',
        ],
      },
      {
        heading: 'Feedback',
        body: [
          'Hush is made by Gokulakrishnan. If something is unclear or broken, open an issue on the Hush.app GitHub repository. Version 1.0.0.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    lead: 'Effective 10 October 2026. Hush is a personal expense tracker that runs on your Android phone. This policy explains what stays on the device and what does not leave it.',
    sections: [
      {
        heading: 'Who this covers',
        body: [
          'Hush is provided by Gokulakrishnan. The app is for personal use on a single device. There is no company server and no cloud account for your money data.',
        ],
      },
      {
        heading: 'What Hush stores',
        body: [
          'On this phone Hush keeps: expenses and incomes (amount, category, title, date), category budgets, your savings goal, your name, and appearance and reminder preferences.',
        ],
      },
      {
        heading: 'What Hush does not do',
        body: [
          'Hush does not send your ledger or budgets to a server. It does not read SMS, UPI or bank accounts. It does not show ads or use third-party analytics. There is no login.',
        ],
      },
      {
        heading: 'Export and sharing',
        body: [
          'Export CSV creates a file on your request. You choose whether to save or share it. Hush does not upload that file.',
        ],
      },
      {
        heading: 'How long it stays',
        body: [
          'Data stays until you delete an entry, reset a day, delete all money data in Profile, or clear the app\'s storage in Android settings. Delete also clears leftover category budgets. Clearing app data also removes preferences. That cannot be undone.',
        ],
      },
      {
        heading: 'Children',
        body: [
          'Hush is not directed at children under 13.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If this policy changes, the date at the top of this screen will change. The current version of the app is 1.0.0.',
        ],
      },
      {
        heading: 'Questions',
        body: [
          'Use Help and feedback in Profile, or open an issue on the Hush.app GitHub repository.',
        ],
      },
    ],
  },
};

export function InfoSheet({
  kind,
  onClose,
}: {
  kind: 'help' | 'privacy';
  onClose: () => void;
}) {
  const copy = COPY[kind];
  return (
    <Sheet label={copy.title} onClose={onClose}>
      <div className="h1" style={{ fontSize: 28 }}>
        {copy.title}
      </div>
      <p className="info-lead">{copy.lead}</p>
      <div className="info-copy">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h3>{section.heading}</h3>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <button className="cta" style={{ background: 'var(--ink)', color: 'var(--bg)' }} onClick={onClose}>
        Done
      </button>
    </Sheet>
  );
}
