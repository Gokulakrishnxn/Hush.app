export type GlyphMode = 'f' | 'l' | 'd' | 's' | 'ds';

export interface Glyph {
  d: string;
  mode: GlyphMode;
}

export interface CategoryStyle {
  color: string;
  glyphs: Glyph[];
}

const HOUSE: Glyph[] = [
  { d: 'M12 3.2L3 10.6V20a1 1 0 001 1h5v-6h6v6h5a1 1 0 001-1v-9.4z', mode: 'f' },
];

const GIFT: Glyph[] = [
  { d: 'M4.5 12h15v8a1 1 0 01-1 1h-13a1 1 0 01-1-1z', mode: 'l' },
  { d: 'M3 8h18v4H3z', mode: 'f' },
  { d: 'M10.8 8h2.4v13h-2.4z', mode: 'f' },
  { d: 'M12 8C9 8 7.6 5.2 9.2 4.2S12 6 12 8zM12 8c3 0 4.4-2.8 2.8-3.8S12 6 12 8z', mode: 'f' },
];

const DOTS: Glyph[] = [
  {
    d: 'M4.1 12a1.9 1.9 0 103.8 0 1.9 1.9 0 10-3.8 0zM10.1 12a1.9 1.9 0 103.8 0 1.9 1.9 0 10-3.8 0zM16.1 12a1.9 1.9 0 103.8 0 1.9 1.9 0 10-3.8 0z',
    mode: 'f',
  },
];

const CIRCLE = 'M12 2.8a9.2 9.2 0 100 18.4 9.2 9.2 0 000-18.4z';

export const EXPENSE_CATEGORIES = [
  'Food',
  'Groceries',
  'Transport',
  'Bills',
  'Rent',
  'EMI',
  'Shopping',
  'Home',
  'Health',
  'Fun',
  'Education',
  'Travel',
  'Gifts',
  'Invest',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Interest',
  'Rental',
  'Investment',
  'Bonus',
  'Refund',
  'Misc',
] as const;

export const DEFAULT_BUDGETS: Record<(typeof EXPENSE_CATEGORIES)[number], number> = {
  Food: 5000,
  Groceries: 6000,
  Transport: 3000,
  Bills: 2500,
  Rent: 14000,
  EMI: 8000,
  Shopping: 3000,
  Home: 2000,
  Health: 3000,
  Fun: 2500,
  Education: 2000,
  Travel: 2000,
  Gifts: 1500,
  Invest: 5000,
  Other: 1500,
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Food: {
    color: '#E8A33D',
    glyphs: [
      { d: 'M5.5 3h1.5v5h1V3h1.5v5h1V3H12v5.5a3.2 3.2 0 01-2.6 3.1L9.5 21H7.9l.1-9.4A3.2 3.2 0 015.5 8.5z', mode: 'f' },
      { d: 'M17 3c-2.2 1.4-3.3 4-3.3 7.2H17V21h1.7V3.3z', mode: 'f' },
    ],
  },
  Groceries: {
    color: '#7DB83A',
    glyphs: [
      { d: 'M2.8 4.3h2.1l.9 3.2', mode: 's' },
      { d: 'M5 7.5h15.2l-1.7 7.6a2 2 0 01-2 1.6H8.9a2 2 0 01-2-1.5z', mode: 'f' },
      { d: 'M7.8 20.2a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0zM14.8 20.2a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z', mode: 'f' },
    ],
  },
  Transport: {
    color: '#4C8DF6',
    glyphs: [
      { d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v12a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 015 17z', mode: 'f' },
      { d: 'M7.5 6h9v5h-9z', mode: 'd' },
      { d: 'M7.4 14.2a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0zM13.8 14.2a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z', mode: 'd' },
      { d: 'M7 18.5h2.5V21H7zM14.5 18.5H17V21h-2.5z', mode: 'f' },
    ],
  },
  Home: { color: '#8E6CE0', glyphs: HOUSE },
  Fun: {
    color: '#E5604F',
    glyphs: [{ d: 'M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.4l6.2-.9z', mode: 'f' }],
  },
  Health: {
    color: '#0F8A6D',
    glyphs: [
      { d: 'M12 21s-8.5-5.3-8.5-11.4A4.7 4.7 0 0112 7.2a4.7 4.7 0 018.5 2.4C20.5 15.7 12 21 12 21z', mode: 'f' },
      { d: 'M6.5 12.8h2.8l1.4-3 2.2 5.2 1.4-2.2h3.2', mode: 'ds' },
    ],
  },
  Bills: {
    color: '#2FB8A6',
    glyphs: [
      { d: 'M6 3h12v18l-2.4-1.6L13.2 21 12 20l-1.2 1-2.4-1.6L6 21z', mode: 'f' },
      { d: 'M9 8h6M9 11.5h6M9 15h3.5', mode: 'ds' },
    ],
  },
  Rent: {
    color: '#C2703D',
    glyphs: [
      { d: 'M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16z', mode: 'f' },
      { d: 'M16 10h2a1 1 0 011 1v10h-3z', mode: 'l' },
      { d: 'M8 6.5h1.8v1.8H8zM11.2 6.5H13v1.8h-1.8zM8 10.5h1.8v1.8H8zM11.2 10.5H13v1.8h-1.8zM8 14.5h1.8v1.8H8zM11.2 14.5H13v1.8h-1.8z', mode: 'd' },
    ],
  },
  EMI: {
    color: '#5B6CD9',
    glyphs: [
      { d: 'M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5z', mode: 'f' },
      { d: 'M3 8.5h18V11H3z', mode: 'd' },
      { d: 'M6 14.5h4v2H6z', mode: 'd' },
    ],
  },
  Shopping: {
    color: '#E26FA6',
    glyphs: [
      { d: 'M9 11V7.5a3 3 0 016 0V11', mode: 's' },
      { d: 'M5.5 8h13l1 12a1 1 0 01-1 1.1H5.5a1 1 0 01-1-1.1z', mode: 'f' },
    ],
  },
  Education: {
    color: '#2E5AAC',
    glyphs: [
      { d: 'M12 3.5L1.8 9 12 14.5 22.2 9z', mode: 'f' },
      { d: 'M6 12.3V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-3.7l-6 3.2z', mode: 'l' },
      { d: 'M20.8 10v5.5', mode: 's' },
    ],
  },
  Gifts: { color: '#D9743A', glyphs: GIFT },
  Travel: {
    color: '#1FA2D6',
    glyphs: [
      { d: 'M21 3.5L2.8 10.6l6.4 2.6 2.6 6.4z', mode: 'f' },
      { d: 'M9.2 13.2L21 3.5', mode: 'ds' },
    ],
  },
  Invest: {
    color: '#3E9B4F',
    glyphs: [
      { d: 'M4 14h3.5v6H4zM10.2 10h3.5v10h-3.5z', mode: 'l' },
      { d: 'M16.4 6h3.5v14h-3.5z', mode: 'f' },
    ],
  },
  Other: { color: '#7A7A85', glyphs: DOTS },
  Salary: {
    color: '#2E9E6B',
    glyphs: [
      { d: 'M2.5 6.5A1.5 1.5 0 014 5h16a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5H4a1.5 1.5 0 01-1.5-1.5z', mode: 'f' },
      { d: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z', mode: 'd' },
      { d: 'M4.8 12a1 1 0 102 0 1 1 0 10-2 0zM17.2 12a1 1 0 102 0 1 1 0 10-2 0z', mode: 'd' },
    ],
  },
  Freelance: {
    color: '#3A86E8',
    glyphs: [
      { d: 'M5 5.5A1.5 1.5 0 016.5 4h11A1.5 1.5 0 0119 5.5V15H5z', mode: 'f' },
      { d: 'M7 6h10v7H7z', mode: 'd' },
      { d: 'M2.5 16.5h19v.5a2 2 0 01-2 2h-15a2 2 0 01-2-2z', mode: 'l' },
    ],
  },
  Business: {
    color: '#8A5CD6',
    glyphs: [
      { d: 'M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7', mode: 's' },
      { d: 'M3 8.5A1.5 1.5 0 014.5 7h15A1.5 1.5 0 0121 8.5V19a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19z', mode: 'f' },
      { d: 'M3 12.5h18V14H3z', mode: 'd' },
      { d: 'M10.5 12h3v3h-3z', mode: 'l' },
    ],
  },
  Interest: {
    color: '#E0A526',
    glyphs: [
      { d: CIRCLE, mode: 'f' },
      { d: 'M8.6 15.4l6.8-6.8', mode: 'ds' },
      { d: 'M7.6 9a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0zM13.6 15a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z', mode: 'd' },
    ],
  },
  Rental: { color: '#C2703D', glyphs: HOUSE },
  Investment: {
    color: '#1F8FB5',
    glyphs: [
      { d: 'M3.5 16.5l5.5-5.5 3.5 3.5 7-7', mode: 's' },
      { d: 'M14.5 6.5H21V13z', mode: 'f' },
    ],
  },
  Bonus: { color: '#E0577A', glyphs: GIFT },
  Refund: {
    color: '#6B7FD7',
    glyphs: [
      { d: CIRCLE, mode: 'f' },
      { d: 'M12.5 8L8.5 12l4 4M9 12h6a2.5 2.5 0 010 5h-1', mode: 'ds' },
    ],
  },
  Misc: { color: '#7A7A85', glyphs: DOTS },
};

export const NAV_ICONS = {
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  chart: 'M5 20V11M12 20V5M19 20v-7',
  plus: 'M12 5v14M5 12h14',
  pie: 'M12 3a9 9 0 109 9h-9z M15 3.5A9 9 0 0120.5 9H15z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6',
  flame: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 0-3-1-5 1-8z',
  calendar: 'M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zM4 10h16M8 3v4M16 3v4',
  chevron: 'M6 9l6 6 6-6',
} as const;

export function categoryStyle(name: string): CategoryStyle {
  return CATEGORY_STYLES[name] ?? CATEGORY_STYLES.Other;
}

export function categoriesFor(type: 'expense' | 'income'): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function tileGradient(color: string): string {
  return `linear-gradient(155deg, ${color}, color-mix(in srgb, ${color} 70%, #000))`;
}
