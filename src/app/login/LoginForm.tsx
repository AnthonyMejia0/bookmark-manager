import { useTheme } from 'next-themes';
import styles from './Login.module.sass';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Spinner } from '@/components/ui/spinner';

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  setMode: Dispatch<SetStateAction<'login' | 'signup' | 'reset'>>;
  loading: boolean;
  error: null | string;
};

function LoginForm({ onSubmit, setMode, loading, error }: LoginFormProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!emailInput || !passwordInput) return;

    onSubmit(emailInput, passwordInput);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoPath =
    theme === 'light'
      ? '/images/logo-light-theme.svg'
      : '/images/logo-dark-theme.svg';

  return (
    <div className={`${styles.loginContainer}`}>
      <Image
        src={logoPath}
        alt="Logo"
        width={214}
        height={32}
        loading="eager"
      />
      <p className={`text-preset-1 ${styles.header}`}>Log in to your account</p>
      <p className={`text-preset-4-md ${styles.subheader}`}>
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label htmlFor="email" className={`text-preset-4 ${styles.formLabel}`}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className={styles.formInput}
          required
          disabled={loading}
        />
        <label
          htmlFor="password"
          className={`text-preset-4 ${styles.formLabel}`}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className={styles.formInput}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className={`text-preset-3 ${styles.formButton}`}
          disabled={loading}
        >
          {loading ? (
            <Spinner height={20} width={20} className={styles.loadingSpinner} />
          ) : (
            'Log in'
          )}
        </button>
        <p className={`text-preset-4-md ${styles.formLinks}`}>
          Forgot password?{' '}
          <button
            className={`text-preset-4 ${styles.formLinksButton}`}
            onClick={() => setMode('reset')}
          >
            Reset it
          </button>
        </p>
        <p className={`text-preset-4-md ${styles.formLinks}`}>
          Don't have an account?{' '}
          <button
            className={`text-preset-4 ${styles.formLinksButton}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
