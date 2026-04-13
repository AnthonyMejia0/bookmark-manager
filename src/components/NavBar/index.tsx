'use client';

import Image from 'next/image';
import styles from './NavBar.module.sass';
import { useTheme } from 'next-themes';
import { useState } from 'react';

function NavBar() {
  const [searchInput, setSearchInput] = useState('');
  const { theme } = useTheme();

  return (
    <div className={styles.navContainer}>
      <button className={`${styles.menuButton} ${styles.menuButtonLeft}`}>
        <Image
          src="/images/icon-menu-hamburger.svg"
          alt="Menu"
          height={20}
          width={20}
          style={{
            filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      </button>

      <div className={styles.searchContainer}>
        <Image
          src="/images/icon-search.svg"
          alt="Search"
          height={20}
          width={20}
          className={styles.searchIcon}
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title..."
          className={`text-preset-4-md ${styles.input}`}
        />
      </div>

      <button className={`${styles.menuButton} ${styles.menuButtonBookmark}`}>
        <Image
          src="/images/icon-add.svg"
          alt="Add Bookmark"
          height={20}
          width={20}
          style={{
            filter: 'brightness(0) invert(1)',
          }}
        />

        <p className={`text-preset-3 ${styles.menuButtonBookmarkText}`}>
          Add Bookmark
        </p>
      </button>

      <button className={styles.avatarButton}>
        <Image
          src="/images/image-avatar.webp"
          alt="User avatar"
          height={40}
          width={40}
        />
      </button>
    </div>
  );
}

export default NavBar;
