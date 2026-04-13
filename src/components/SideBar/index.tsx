'use client';

import { useTheme } from 'next-themes';
import styles from './SideBar.module.sass';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Tag as TagType } from '@/types/tag';
import { Archive, House } from 'lucide-react';
import Tag from '../Tag';

type SideBarProps = {
  tags: TagType[];
  toggleTag: (tag: string) => void;
};

function SideBar({ tags, toggleTag }: SideBarProps) {
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
    <div className={styles.sidebarContainer}>
      <Image
        src={logoPath}
        alt="Logo"
        width={214}
        height={32}
        loading="eager"
      />

      <div className={styles.sidebarNav}>
        <button className={`text-preset-3 ${styles.sidebarButton}`}>
          <House height={20} width={20} className={styles.sidebarIcon} />
          Home
        </button>
        <button className={`text-preset-3 ${styles.sidebarButton}`}>
          <Archive height={20} width={20} className={styles.sidebarIcon} />
          Archived
        </button>
      </div>

      <div className={styles.sidebarTags}>
        {tags?.map((tag, i) => (
          <Tag key={i} tag={tag} toggleTag={toggleTag}></Tag>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
