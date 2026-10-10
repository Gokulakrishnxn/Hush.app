import { NAV_ICONS } from '@/domain/categories';
import type { Tab } from '@/domain/types';
import { Icon } from './Icon';

const TABS: Array<[Tab, string, string] | null> = [
  ['home', 'Home', NAV_ICONS.home],
  ['analytics', 'Analytics', NAV_ICONS.chart],
  null,
  ['budget', 'Budget', NAV_ICONS.pie],
  ['profile', 'Profile', NAV_ICONS.user],
];

export function NavBar({
  tab,
  onTab,
  onAdd,
}: {
  tab: Tab;
  onTab: (tab: Tab) => void;
  onAdd: () => void;
}) {
  return (
    <nav className="nav" aria-label="Main">
      {TABS.map((item) => {
        if (!item) {
          return (
            <button key="add" className="plus" aria-label="Add expense" onClick={onAdd}>
              <Icon d={NAV_ICONS.plus} size={26} width={2.2} />
            </button>
          );
        }
        const [id, label, icon] = item;
        const on = tab === id;
        return (
          <button
            key={id}
            className={on ? 'nb on' : 'nb'}
            onClick={() => onTab(id)}
            aria-current={on ? 'page' : undefined}
          >
            <Icon d={icon} width={on ? 2.3 : 1.8} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
