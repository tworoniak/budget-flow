import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const PRIMARY_NAV = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/expenses', label: 'Expenses', icon: '↕' },
  { to: '/budget', label: 'Budgets', icon: '◎' },
];

const SECONDARY_NAV = [
  { to: '/analytics', label: 'Analytics', icon: '▲', disabled: true },
  { to: '/income', label: 'Income', icon: '＋', disabled: true },
  { to: '/recurring', label: 'Recurring', icon: '↻', disabled: true },
];

const BOTTOM_NAV = [
  { to: '/categories', label: 'Categories', icon: '⊟', disabled: true },
  { to: '/settings', label: 'Settings', icon: '⚙', disabled: true },
];

interface NavItemProps {
  to: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

function NavItem({ to, label, icon, disabled }: NavItemProps) {
  if (disabled) {
    return (
      <span className={`${styles.navItem} ${styles.disabled}`}>
        <span className={styles.navIcon}>{icon}</span>
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
      <span className={styles.navIcon}>{icon}</span>
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
