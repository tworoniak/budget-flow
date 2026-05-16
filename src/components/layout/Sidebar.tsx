import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart2,
  DollarSign,
  RefreshCw,
  Tag,
  Settings,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

const PRIMARY_NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/budget', label: 'Budgets', icon: Target },
];

const SECONDARY_NAV: { to: string; label: string; icon: LucideIcon; disabled: true }[] = [
  { to: '/analytics', label: 'Analytics', icon: BarChart2, disabled: true },
  { to: '/income', label: 'Income', icon: DollarSign, disabled: true },
  { to: '/recurring', label: 'Recurring', icon: RefreshCw, disabled: true },
];

const BOTTOM_NAV: { to: string; label: string; icon: LucideIcon; disabled: true }[] = [
  { to: '/categories', label: 'Categories', icon: Tag, disabled: true },
  { to: '/settings', label: 'Settings', icon: Settings, disabled: true },
];

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

function NavItem({ to, label, icon: Icon, disabled }: NavItemProps) {
  if (disabled) {
    return (
      <span className={`${styles.navItem} ${styles.disabled}`}>
        <Icon size={15} className={styles.navIcon} />
        <span className={styles.navLabel}>{label}</span>
      </span>
    );
  }
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ''}`
      }
    >
      <Icon size={15} className={styles.navIcon} />
      <span className={styles.navLabel}>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>B</div>
        <span className={styles.logoText}>BudgetFlow</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className={styles.navDivider} />

        <div className={styles.navSection}>
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.navSection}>
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className={styles.trackCard}>
          <div className={styles.trackDot} />
          <div className={styles.trackText}>
            <span className={styles.trackLabel}>You're on track</span>
            <span className={styles.trackSub}>Spending is within budget</span>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>A</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Alex Dean</span>
            <span className={styles.profileRole}>Personal</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
