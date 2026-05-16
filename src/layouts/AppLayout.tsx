import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useRecurringCheck } from '../hooks/useRecurringCheck';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  useRecurringCheck();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
