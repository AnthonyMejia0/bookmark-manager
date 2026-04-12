import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import styles from './Dashboard.module.sass';
import { redirect } from 'next/navigation';

async function Dashboard() {
  //   const supabase = await createSupabaseServerClient();

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   console.log('USER =>', user);

  //   if (!user) redirect('/login');

  return <div>Dashboard</div>;
}

export default Dashboard;
