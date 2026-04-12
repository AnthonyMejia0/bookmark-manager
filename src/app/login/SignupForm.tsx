import { useTheme } from 'next-themes';
import styles from './Login.module.sass';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

type SignupFormProps = {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  setMode: Dispatch<SetStateAction<'login' | 'signup' | 'reset'>>;
  loading: boolean;
  error: null | string;
};

function SignupForm({ onSubmit, setMode, loading, error }: SignupFormProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    const emailValue = e.target.elements.namedItem('email') as HTMLInputElement;

    if (!emailValue.checkValidity()) setEmailError(true);
    if (passwordInput.length < 8) setPasswordError(true);

    onSubmit(nameInput, emailInput, passwordInput);
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
      <p className={`text-preset-1 ${styles.header}`}>Create your account</p>
      <p className={`text-preset-4-md ${styles.subheader}`}>
        Join us and start saving your favorite links — organized, searchable,
        and always within reach.
      </p>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label htmlFor="name" className={`text-preset-4 ${styles.formLabel}`}>
          Full name{' '}
          <span className={`text-preset-4 ${styles.formLabelAccent}`}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className={styles.formInput}
          disabled={loading}
        />
        <label htmlFor="email" className={`text-preset-4 ${styles.formLabel}`}>
          Email address{' '}
          <span className={`text-preset-4 ${styles.formLabelAccent}`}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className={`${styles.formInput} ${
            emailError && styles.formInputError
          }`}
          disabled={loading}
        />
        {emailError && (
          <p className={`text-preset-4-md ${styles.formError}`}>
            Enter a valid email address.
          </p>
        )}
        <label
          htmlFor="password"
          className={`text-preset-4 ${styles.formLabel}`}
        >
          Password{' '}
          <span className={`text-preset-4 ${styles.formLabelAccent}`}>*</span>
        </label>
        <input
          type="password"
          name="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className={`${styles.formInput} ${
            passwordError && styles.formInputError
          }`}
          disabled={loading}
        />
        {passwordError && (
          <p className={`text-preset-4-md ${styles.formError}`}>
            Must be at least 8 characters long.
          </p>
        )}
        <button
          type="submit"
          className={`text-preset-3 ${styles.formButton}`}
          disabled={loading}
        >
          Create account
        </button>
        <p className={`text-preset-4-md ${styles.formLinks}`}>
          Already have an account?{' '}
          <button
            className={`text-preset-4 ${styles.formLinksButton}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
