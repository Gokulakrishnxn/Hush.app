import { useState } from 'react';
import { useStore } from '@/data/StoreProvider';
import { AddSheet } from '@/features/add/AddSheet';
import { AnalyticsScreen } from '@/features/analytics/AnalyticsScreen';
import { BudgetScreen } from '@/features/budget/BudgetScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { StreakSheet } from '@/features/streak/StreakSheet';
import type { Entry, Tab } from '@/domain/types';
import { NavBar } from '@/ui/NavBar';
import { Toast } from '@/ui/Toast';

export default function App() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>('home');
  const [editor, setEditor] = useState<Entry | true | null>(null);
  const [streakOpen, setStreakOpen] = useState(false);

  if (!store.ready) {
    return (
      <div className="device">
        <div className="boot">Hush</div>
      </div>
    );
  }

  const hide = store.settings.hideAmounts;

  return (
    <div className="device">
      {tab === 'home' ? (
        <HomeScreen
          expenses={store.expenses}
          incomes={store.incomes}
          budgets={store.settings.budgets}
          name={store.settings.name}
          hide={hide}
          onOpen={setEditor}
          onStreak={() => setStreakOpen(true)}
        />
      ) : null}
      {tab === 'analytics' ? (
        <AnalyticsScreen expenses={store.expenses} incomes={store.incomes} hide={hide} />
      ) : null}
      {tab === 'budget' ? (
        <BudgetScreen
          expenses={store.expenses}
          incomes={store.incomes}
          budgets={store.settings.budgets}
          hide={hide}
          onBudget={store.changeBudget}
          onEdit={setEditor}
        />
      ) : null}
      {tab === 'profile' ? (
        <ProfileScreen
          expenses={store.expenses}
          incomes={store.incomes}
          settings={store.settings}
          onSettings={store.updateSettings}
        />
      ) : null}

      <NavBar tab={tab} onTab={setTab} onAdd={() => setEditor(true)} />
      <Toast toast={store.toast} onUndo={store.undoDelete} />

      {editor ? (
        <AddSheet
          key={editor === true ? 'new' : editor.id}
          initial={editor === true ? null : editor}
          onClose={() => setEditor(null)}
          onSave={(draft, existing) => {
            store.saveEntry(draft, existing);
            setEditor(null);
          }}
          onDelete={() => {
            if (editor !== true) store.deleteEntry(editor);
            setEditor(null);
          }}
        />
      ) : null}

      {streakOpen ? <StreakSheet expenses={store.expenses} onClose={() => setStreakOpen(false)} /> : null}
    </div>
  );
}
