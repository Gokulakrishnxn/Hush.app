import { NAV_ICONS } from '@/domain/categories';
import { toISODate } from '@/domain/dates';
import { bestStreak, currentStreak, nextMilestone, weekDots } from '@/domain/streak';
import type { Entry } from '@/domain/types';
import { Icon } from '@/ui/Icon';
import { Sheet } from '@/ui/Sheet';

export function StreakSheet({ expenses, onClose }: { expenses: Entry[]; onClose: () => void }) {
  const dates = expenses.map((entry) => entry.date);
  const streak = currentStreak(dates);
  const today = toISODate();
  const todayDone = dates.includes(today);
  const best = bestStreak(dates);
  const next = nextMilestone(streak);
  const week = weekDots(dates);

  return (
    <Sheet label="Your streak" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '4px 0 6px' }}>
        <div className="flame" style={{ width: 72, height: 72, borderRadius: '22%', margin: '0 auto' }}>
          <Icon d={NAV_ICONS.flame} size={40} color="#fff" />
        </div>
        <div className="big" style={{ fontSize: 48, marginTop: 14 }}>
          {streak}
        </div>
        <div className="t" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
          day streak
        </div>
        <div className="m">
          {todayDone
            ? 'You logged today. Come back tomorrow to keep it going.'
            : streak > 0
              ? 'Log an expense today to keep your streak alive.'
              : 'Log an expense to start a streak.'}
        </div>
      </div>
      <div className="days">
        {week.map((day) => (
          <div className="dot" key={day.date}>
            <i className={`${day.on ? 'on' : ''}${day.offset === 0 ? ' now' : ''}`}>
              {day.on ? <Icon d={NAV_ICONS.flame} size={15} color="#fff" /> : null}
            </i>
            <span>{day.letter}</span>
          </div>
        ))}
      </div>
      <div className="stats2">
        <div>
          <b>{best} days</b>
          <span>Best streak</span>
        </div>
        <div>
          <b>{next - streak} days</b>
          <span>To reach {next}</span>
        </div>
      </div>
      <button className="cta" style={{ background: 'var(--ink)', color: 'var(--bg)' }} onClick={onClose}>
        Done
      </button>
    </Sheet>
  );
}
