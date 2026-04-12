'use client';

import { useMemo, useState } from 'react';
import styles from './Login.module.sass';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetForm from './ResetForm';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup' | 'reset';

function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  const handleReset = async () => {};

  switch (mode) {
    case 'login':
      return (
        <div className={styles.authContainer}>
          <LoginForm
            onSubmit={handleLogin}
            setMode={setMode}
            loading={loading}
            error={error}
          />
        </div>
      );
    case 'signup':
      return (
        <div className={styles.authContainer}>
          <SignupForm
            onSubmit={handleSignup}
            setMode={setMode}
            loading={loading}
            error={error}
          />
        </div>
      );
    case 'reset':
      return (
        <div className={styles.authContainer}>
          <ResetForm
            onSubmit={handleReset}
            setMode={setMode}
            loading={loading}
            error={error}
          />
        </div>
      );
  }
}

export default AuthForm;
