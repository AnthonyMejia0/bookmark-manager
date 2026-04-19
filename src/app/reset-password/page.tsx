'use client';

import { useTheme } from 'next-themes';
import styles from '../login/Login.module.sass';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { toast } from 'sonner';
import { Check, RefreshCwOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

function ResetForm() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword || password != confirmPassword) return;
    if (password.length < 8) return;

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.log(error.message);
      toast('Failed to reset password', {
        icon: <RefreshCwOff height={20} width={20} className="toastIcon" />,
      });
      setLoading(false);
      return;
    }

    toast.success('Password updated successfully', {
      icon: <Check height={20} width={20} className="toastIcon" />,
    });

    await supabase.auth.signOut();

    router.push('/login');
  };

  useEffect(() => {
    if (password && password.length < 8) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (password && confirmPassword && password != confirmPassword) {
      setMismatch(true);
    } else {
      setMismatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoPath =
    theme === 'light'
      ? '/images/logo-light-theme.svg'
      : '/images/logo-dark-theme.svg';

  return (
    <div className={styles.confirmEmailContainer}>
      <div className={`${styles.loginContainer}`}>
        <Image
          src={logoPath}
          alt="Logo"
          width={214}
          height={32}
          loading="eager"
        />
        <p className={`text-preset-1 ${styles.header}`}>Reset your password</p>
        <p className={`text-preset-4-md ${styles.subheader}`}>
          Enter your new password below. Make sure it's strong and secure.
        </p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label
            htmlFor="password"
            className={`text-preset-4 ${styles.formLabel}`}
          >
            New password{' '}
            <span className={`text-preset-4 ${styles.formLabelAccent}`}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={`${styles.formInput} ${
              passwordError && styles.formInputError
            }`}
            disabled={loading}
            required
          />
          {passwordError && (
            <p className={`text-preset-4-md ${styles.mismatch}`}>
              Must be at least 8 characters long.
            </p>
          )}
          <label
            htmlFor="confirm-password"
            className={`text-preset-4 ${styles.formLabel}`}
          >
            Confirm password{' '}
            <span className={`text-preset-4 ${styles.formLabelAccent}`}>*</span>
          </label>
          <input
            type="password"
            name="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
            className={`${styles.formInput} ${
              mismatch && styles.formInputError
            }`}
            disabled={loading}
            required
          />
          {mismatch && (
            <p className={`text-preset-4-md ${styles.mismatch}`}>
              Passwords do not match
            </p>
          )}
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
              'Reset password'
            )}
          </button>
          <button
            onClick={() => router.push('login')}
            className={`text-preset-4 ${styles.formLinksButton} ${styles.backToLogin}`}
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetForm;
