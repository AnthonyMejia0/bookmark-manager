import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import styles from './Dashboard.module.sass';
import { redirect } from 'next/navigation';
import NavBar from '@/components/NavBar';

async function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <NavBar />
    </div>
  );
}

export default Dashboard;
