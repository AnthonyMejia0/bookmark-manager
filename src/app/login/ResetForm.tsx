import { useTheme } from 'next-themes';
import styles from './Login.module.sass';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

type ResetFormProps = {
  onSubmit: (email: string) => Promise<boolean>;
  setMode: Dispatch<SetStateAction<'login' | 'signup' | 'reset'>>;
  loading: boolean;
  error: null | string;
};

function ResetForm({ onSubmit, setMode, loading, error }: ResetFormProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const successful = await onSubmit(emailInput);
    if (successful) {
      setEmailSent(true);
    }
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
      <p className={`text-preset-1 ${styles.header}`}>Forgot your password?</p>
      <p className={`text-preset-4-md ${styles.subheader}`}>
        Enter your email address below and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label htmlFor="email" className={`text-preset-4 ${styles.formLabel}`}>
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className={styles.formInput}
          disabled={loading}
        />
        {emailSent ? (
          <button
            type="submit"
            className={`text-preset-3 ${styles.formButton} ${styles.emailSent}`}
            disabled
          >
            Email sent
          </button>
        ) : (
          <button
            type="submit"
            className={`text-preset-3 ${styles.formButton}`}
            disabled={loading}
          >
            {loading ? (
              <Spinner
                height={20}
                width={20}
                className={styles.loadingSpinner}
              />
            ) : (
              'Send reset link'
            )}
          </button>
        )}
        <button
          onClick={() => setMode('login')}
          className={`text-preset-4 ${styles.formLinksButton} ${styles.backToLogin}`}
        >
          Back to login
        </button>
      </form>
    </div>
  );
}

export default ResetForm;
