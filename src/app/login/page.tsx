import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import styles from './Login.module.sass';
import { redirect } from 'next/navigation';
import AuthForm from './AuthForm';

async function Login() {
  return <AuthForm />;
}

export default Login;
