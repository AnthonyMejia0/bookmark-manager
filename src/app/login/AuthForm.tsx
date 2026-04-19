'use client';

import { useMemo, useState } from 'react';
import styles from './Login.module.sass';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetForm from './ResetForm';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MailWarning, Send, UserRoundX } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      toast('User not found.', {
        icon: <UserRoundX height={20} width={20} className="toastIcon" />,
      });
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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${BASE_URL}/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      toast('Error creating user.', {
        icon: <UserRoundX height={20} width={20} className="toastIcon" />,
      });
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  const handleReset = async (email: string) => {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${BASE_URL}/reset-password`,
    });

    if (error) {
      console.log(error.message);
      toast('Failed to send reset email.', {
        icon: <MailWarning height={20} width={20} className="toastIcon" />,
      });
      setLoading(false);
      return;
    }

    toast.success('Password reset email sent', {
      icon: <Send height={20} width={20} className="toastIcon" />,
    });
    setLoading(false);
  };

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
