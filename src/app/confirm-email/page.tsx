'use client';

import Image from 'next/image';
import styles from '../login/Login.module.sass';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

function ConfirmEmail() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

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
        <Image src={logoPath} alt="Logo" width={214} height={32} />
        <p className={`text-preset-1 ${styles.header}`}>Confirm your email</p>
        <p className={`text-preset-4-md ${styles.subheader}`}>
          Use the link sent to your email to login with your new account.
        </p>
      </div>
    </div>
  );
}

export default ConfirmEmail;
