'use client';

import Image from 'next/image';
import styles from './NavBar.module.sass';
import { useTheme } from 'next-themes';
import {
  Dispatch,
  ReactEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from '@/types/user';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Separator } from '../ui/separator';
import {
  LogOut,
  Menu,
  Moon,
  Palette,
  Plus,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import axios from 'axios';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkPost } from '@/types/bookmark';
import { getFaviconUrl, normalizeUrl } from '@/lib/utils';

type NavBarProps = {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => Promise<void>;
};

function NavBar({
  searchInput,
  setSearchInput,
  setSidebarOpen,
  refetch,
}: NavBarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const handleAddBookmark = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!titleInput || !urlInput) {
      console.log('Missing required fields');
      return;
    }

    setLoading(true);

    const tags: string[] = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      const { data: newBookmark } = await axios.post('/api/bookmarks', {
        title: titleInput,
        url: normalizeUrl(urlInput),
        favicon: getFaviconUrl(urlInput),
        description: descInput,
        tags: tags,
      } as BookmarkPost);
      if (newBookmark.error) {
        console.log(newBookmark.error);
        return;
      }
      setTitleInput('');
      setUrlInput('');
      setDescInput('');
      setTagsInput('');
      await refetch();
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

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

      <Dialog>
        <DialogTrigger asChild>
          <button
            className={`${styles.menuButton} ${styles.menuButtonBookmark}`}
          >
            <Plus height={20} width={20} className={styles.addIcon} />
            <p className={`text-preset-3 ${styles.menuButtonBookmarkText}`}>
              Add Bookmark
            </p>
          </button>
        </DialogTrigger>
        <DialogContent className={styles.dialog}>
          <DialogHeader>
            <DialogTitle className={`text-preset-1 ${styles.dialogTitle}`}>
              Add a Bookmark
            </DialogTitle>
            <DialogDescription
              className={`text-preset-4-md ${styles.dialogdescription}`}
            >
              Save a link with details to keep your collection organized.
            </DialogDescription>
            <form
              className={styles.dialogForm}
              onSubmit={(e) => handleAddBookmark(e)}
            >
              <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
                Title <span className={styles.dialogFormLabelStar}>*</span>
              </label>
              <input
                type="text"
                className={`text-preset-4-md ${styles.dialogFormInput}`}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                required
              />

              <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
                Description{' '}
                <span className={styles.dialogFormLabelStar}>*</span>
              </label>
              <textarea
                className={`text-preset-4-md ${styles.dialogFormInput} ${styles.dialogFormInputArea}`}
                maxLength={280}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                required
              />
              <p className={`text-preset-5 ${styles.dialogFormCounter}`}>
                {descInput.length} / 280
              </p>

              <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
                Website URL{' '}
                <span className={styles.dialogFormLabelStar}>*</span>
              </label>
              <input
                type="text"
                className={`text-preset-4-md ${styles.dialogFormInput}`}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
              />

              <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
                Tags <span className={styles.dialogFormLabelStar}>*</span>
              </label>
              <input
                type="text"
                className={`text-preset-4-md ${styles.dialogFormInput}`}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. design, learning, tools"
                required
              />

              <div className={styles.dialogFormButtons}>
                <DialogClose asChild>
                  <button
                    className={`text-preset-3 ${styles.dialogFormButtonsCancel}`}
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  className={`text-preset-3 ${styles.dialogFormButtonsAdd}`}
                  type="submit"
                  disabled={loading}
                >
                  Add Bookmark
                </button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* <button className={`${styles.menuButton} ${styles.menuButtonBookmark}`}>
        <Plus height={20} width={20} className={styles.addIcon} />
        <p className={`text-preset-3 ${styles.menuButtonBookmarkText}`}>
          Add Bookmark
        </p>
      </button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.avatarButton}>
            <Image
              src="/images/image-avatar.webp"
              alt="User avatar"
              height={40}
              width={40}
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
