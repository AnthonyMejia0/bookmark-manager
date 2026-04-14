'use client';

import Image from 'next/image';
import styles from './NavBar.module.sass';
import { useTheme } from 'next-themes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from '@/types/user';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Separator } from '../ui/separator';
import { LogOut, Menu, Moon, Palette, Plus, Search, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NavBarProps = {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

function NavBar({ searchInput, setSearchInput, setSidebarOpen }: NavBarProps) {
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const changeTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log('Error signing out: ', error.message);
      return;
    }

    router.push('/login');
  };

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUser(data.user);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className={styles.navContainer}>
      <button
        className={`${styles.menuButton} ${styles.menuButtonLeft}`}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu height={20} width={20} className={styles.menuIcon} />
      </button>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} height={20} width={20} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title..."
          className={`text-preset-4-md ${styles.input}`}
        />
      </div>

      <button className={`${styles.menuButton} ${styles.menuButtonBookmark}`}>
        <Plus height={20} width={20} className={styles.addIcon} />
        <p className={`text-preset-3 ${styles.menuButtonBookmarkText}`}>
          Add Bookmark
        </p>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.avatarButton}>
            <Image
              src="/images/image-avatar.webp"
              alt="User avatar"
              height={40}
              width={40}
              loading="eager"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`py-3! rounded-[8px]! mt-2! mr-3! min-w-screen! md:min-w-62! md:w-max! ring-0! ${styles.menu}`}
        >
          <DropdownMenuGroup>
            <div className={styles.userInfo}>
              <Image
                src="/images/image-avatar.webp"
                alt="User Avatar"
                height={40}
                width={40}
              />
              <div className={styles.userInfoDetails}>
                <p
                  className={`text-preset-4 ${styles.userInfoDetailsText} ${styles.userInfoDetailsTextPrimary}`}
                >
                  {user?.user_metadata?.name}
                </p>
                <p
                  className={`text-preset-4-md ${styles.userInfoDetailsText} ${styles.userInfoDetailsTextSecondary}`}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuGroup>
          <Separator className={styles.divider} />
          <DropdownMenuGroup>
            <div className={styles.themeSetting}>
              <p className={`text-preset-4 ${styles.themeSettingLabel}`}>
                <Palette
                  className={styles.paletteIcon}
                  height={16}
                  width={16}
                />
                Theme
              </p>

              <button className={styles.themeButton} onClick={changeTheme}>
                <div
                  className={`${styles.themeButtonSelect} ${
                    theme === 'light' && styles.themeButtonSelectSelected
                  }`}
                >
                  <Sun className={styles.themeIcons} height={14} width={14} />
                </div>
                <div
                  className={`${styles.themeButtonSelect} ${
                    theme === 'dark' && styles.themeButtonSelectSelected
                  }`}
                >
                  <Moon className={styles.themeIcons} height={14} width={14} />
                </div>
              </button>
            </div>
          </DropdownMenuGroup>
          <Separator className={styles.divider} />
          <button className={styles.logout} onClick={handleSignOut}>
            <LogOut height={16} width={16} className={styles.paletteIcon} />
            <p className={`text-preset-4 ${styles.themeSettingLabel}`}>
              Logout
            </p>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NavBar;
