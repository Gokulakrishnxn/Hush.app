import { describe, expect, it } from 'vitest';
import { bestStreak, currentStreak, nextMilestone } from './streak';

describe('currentStreak', () => {
  it('keeps yesterday alive while today is still open', () => {
    expect(currentStreak(['2026-10-09', '2026-10-08'], '2026-10-10')).toBe(2);
  });

  it('includes today when an expense was logged', () => {
    expect(currentStreak(['2026-10-10', '2026-10-09'], '2026-10-10')).toBe(2);
  });

  it('breaks after a full empty day', () => {
    expect(currentStreak(['2026-10-08'], '2026-10-10')).toBe(0);
  });
});

describe('bestStreak', () => {
  it('finds the longest consecutive run', () => {
    expect(bestStreak(['2026-10-01', '2026-10-02', '2026-10-04', '2026-10-05', '2026-10-06'])).toBe(3);
  });
});

describe('nextMilestone', () => {
  it('picks the next named mark', () => {
    expect(nextMilestone(7)).toBe(14);
  });
});
