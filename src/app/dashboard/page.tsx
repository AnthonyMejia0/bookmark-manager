'use client';

import styles from './Dashboard.module.sass';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { useEffect, useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, Check } from 'lucide-react';
import Bookmark from '@/components/Bookmark';

function Dashboard() {
  const [showArchived, setShowArchived] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    filteredBookmarks,
    searchInput,
    setSearchInput,
    tags,
    toggleTag,
    selectedTags,
    sortBy,
    setSortBy,
  } = useBookmarks();

  useEffect(() => {
    if (selectedTags.length > 0) {
      setSearchInput('');
    }
  }, [showArchived, selectedTags]);

  const getHeaderText = () => {
    if (searchInput) {
      return (
        <p className={styles.mainSectionHeader}>
          Results for:{' '}
          <span className={styles.mainSectionHeaderTags}>"{searchInput}"</span>
        </p>
      );
    }

    if (selectedTags.length > 0) {
      return (
        <p className={styles.mainSectionHeader}>
          Bookmarks tagged:{' '}
          <span className={styles.mainSectionHeaderTags}>
            {selectedTags.join(', ')}
          </span>
        </p>
      );
    }

    return (
      <p className={styles.mainSectionHeader}>
        {showArchived ? 'Archived bookmarks' : 'All bookmarks'}
      </p>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      {sidebarOpen && (
        <div
          className={styles.dashboardContainerBackdrop}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className={`${styles.sidebar} ${sidebarOpen && styles.sidebarOpen}`}>
        <SideBar
          tags={tags}
          toggleTag={toggleTag}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      </div>
      <div className={styles.mainContainer}>
        <NavBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSidebarOpen={setSidebarOpen}
        />
        <div className={styles.mainSection}>
          <div className={styles.mainSectionTitle}>
            {getHeaderText()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`text-preset-3 ${styles.mainSectionSort}`}>
                  <ArrowUpDown
                    height={20}
                    width={20}
                    className={styles.mainSectionSortIcon}
                  />
                  Sort by
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`py-3! rounded-[8px]! mt-2! w-50! ring-0! ${styles.menu}`}
                side="bottom"
                align="end"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setSortBy('recently added')}
                    disabled={sortBy === 'recently added'}
                  >
                    Recently added
                    {sortBy === 'recently added' && (
                      <Check height={16} width={16} />
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setSortBy('recently visited')}
                    disabled={sortBy === 'recently visited'}
                  >
                    Recently visited
                    {sortBy === 'recently visited' && (
                      <Check height={16} width={16} />
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setSortBy('most visited')}
                    disabled={sortBy === 'most visited'}
                  >
                    Most visited
                    {sortBy === 'most visited' && (
                      <Check height={16} width={16} />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <main className={styles.mainSectionBookmarks}>
            {Array.isArray(filteredBookmarks) &&
              filteredBookmarks?.map((bookmark, i) => (
                <Bookmark key={i} bookmark={bookmark} />
              ))}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
