import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import styles from './Login.module.sass';
import { redirect } from 'next/navigation';
import AuthForm from './AuthForm';

async function Login() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });

  if (user) {
    redirect('/dashboard');
  }

  return <AuthForm />;
}

export default Login;
