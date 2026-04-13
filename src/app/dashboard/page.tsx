'use client';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import styles from './Dashboard.module.sass';
import { redirect } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { useState } from 'react';
import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { useBookmarks } from '@/hooks/useBookmarks';

function Dashboard() {
  const { bookmarks, tags, toggleTag } = useBookmarks();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <SideBar tags={tags} toggleTag={toggleTag} />
      </div>
      <main className={styles.mainSection}>
        <NavBar />
      </main>
    </div>
  );
}

export default Dashboard;
