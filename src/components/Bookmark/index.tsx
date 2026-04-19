'use client';

import { BookmarkPut, Bookmark as BookmarkType } from '@/types/bookmark';
import styles from './Bookmark.module.sass';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Archive,
  Calendar,
  Clock,
  Copy,
  EllipsisVertical,
  Eye,
  LucideIcon,
  Pin,
  PinOff,
  RotateCcw,
  SquareArrowOutUpRight,
  SquarePen,
  Trash2,
  Unlink,
} from 'lucide-react';
import Link from 'next/link';
import { getFaviconUrl } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';
import EditBookmark from '@/modals/EditBookmark';
import { useState } from 'react';
import Confirm from '@/modals/Confirm';

type BookmarkComponentProps = {
  bookmark: BookmarkType;
  refetch: () => Promise<void>;
};

function Bookmark({ bookmark, refetch }: BookmarkComponentProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmArchive, setOpenConfirmArchive] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';

    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookmark?.url);
      toast('Link copied to clipboard.', {
        icon: <Copy height={20} width={20} className="toastIcon" />,
      });
    } catch {
      toast('Failed to copy link.', {
        icon: <Unlink height={20} width={20} className="toastIcon" />,
      });
    }
  };

  const handleVisit = async () => {
    try {
      await axios.put('/api/bookmarks', {
        id: bookmark.id,
        visit_count: bookmark.visit_count + 1,
      } as BookmarkPut);

      refetch();
    } catch (error) {
      console.log('Error updating bookmark: ', error);
    }
  };

  const togglePin = async () => {
    try {
      const wasPinned = bookmark.pinned;

      await axios.put('/api/bookmarks', {
        id: bookmark.id,
        pin: !bookmark.pinned,
      } as BookmarkPut);

      refetch();

      if (wasPinned) {
        toast('Bookmark unpinned.', {
          icon: <PinOff height={20} width={20} className="toastIcon" />,
        });
      } else {
        toast('Bookmark pinned to top.', {
          icon: <Pin height={20} width={20} className="toastIcon" />,
        });
      }
    } catch (error) {
      console.log('Error updating bookmark: ', error);
    }
  };

  const toggleArchive = async () => {
    setLoading(true);

    try {
      const wasArchived = bookmark.archived;

      await axios.put('/api/bookmarks', {
        id: bookmark.id,
        archive: !bookmark.archived,
        pin: !wasArchived ? false : bookmark.pinned,
      } as BookmarkPut);

      refetch();

      if (wasArchived) {
        toast('Bookmark restored.', {
          icon: <RotateCcw height={20} width={20} className="toastIcon" />,
        });
      } else {
        toast('Bookmark archived.', {
          icon: <Archive height={20} width={20} className="toastIcon" />,
        });
      }
    } catch (error) {
      console.log('Error updating bookmark: ', error);
    } finally {
      setLoading(false);
      setOpenConfirmArchive(false);
    }
  };

  const deleteBookmark = async () => {
    setLoading(true);

    try {
      await axios.delete(`/api/bookmarks/${bookmark.id}`);

      refetch();

      toast('Bookmark deleted.', {
        icon: <Trash2 height={20} width={20} className="toastIcon" />,
      });
    } catch (error) {
      console.log('Error deleting bookmark: ', error);
    } finally {
      setLoading(false);
      setOpenConfirmDelete(false);
    }
  };

  return (
    <div className={styles.bookmarkContainer}>
      <EditBookmark
        key={bookmark.id}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        bookmark={bookmark}
        refetch={refetch}
      />
      <Confirm
        open={openConfirmDelete}
        setOpen={setOpenConfirmDelete}
        loading={loading}
        title="Delete bookmark"
        description="Are you sure you want to delete this bookmark?"
        confirmationText="Delete permanently"
        isDelete
        onConfirm={deleteBookmark}
      />
      <Confirm
        open={openConfirmArchive}
        setOpen={setOpenConfirmArchive}
        loading={loading}
        title={bookmark.archived ? 'Unarchive bookmark' : 'Archive bookmark'}
        description={
          bookmark.archived
            ? 'Move this bookmark back to your active list?'
            : 'Are you sure you want to archive this bookmark?'
        }
        confirmationText={bookmark.archived ? 'Unarchive' : 'Archive'}
        onConfirm={toggleArchive}
      />

      <div className={styles.bookmarkContainerTop}>
        <div className={styles.bookmarkContainerTopHeader}>
          <div className={styles.bookmarkContainerTopHeaderIcon}>
            {bookmark?.url && (
              <img
                src={getFaviconUrl(bookmark?.url)}
                alt="Bookmark Icon"
                height={28}
                width={28}
              />
            )}
          </div>
          <Link
            href={bookmark?.url}
            onClick={handleVisit}
            target="_blank"
            className={styles.bookmarkContainerTopHeaderDetails}
          >
            <p
              className={`text-preset-2 ${styles.bookmarkContainerTopHeaderDetailsTitle}`}
            >
              {bookmark?.title}
            </p>
            {bookmark?.url && (
              <p
                className={`text-preset-5 ${styles.bookmarkContainerTopHeaderDetailsUrl}`}
              >
                {new URL(bookmark?.url).hostname}
              </p>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`${styles.bookmarkContainerTopHeaderIcon} ${styles.bookmarkContainerTopHeaderOptions}`}
              >
                <EllipsisVertical
                  height={20}
                  width={20}
                  className={styles.bookmarkContainerTopHeaderEllipse}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`py-3! rounded-[8px]! mt-1.5! w-50! ring-0! ${styles.menu}`}
              side="bottom"
              align="end"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    href={bookmark?.url}
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={handleVisit}
                    target="_blank"
                  >
                    <SquareArrowOutUpRight
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Visit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`text-preset-4 ${styles.menuOption}`}
                  onClick={copyToClipboard}
                >
                  <Copy
                    height={16}
                    width={16}
                    className={styles.menuOptionIcon}
                  />
                  Copy URL
                </DropdownMenuItem>
                {!bookmark?.archived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={togglePin}
                  >
                    <Pin
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                      style={{
                        transform: 'rotate(45deg)',
                      }}
                    />
                    {bookmark?.pinned ? 'Unpin' : 'pin'}
                  </DropdownMenuItem>
                )}
                {!bookmark?.archived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setOpenEdit(true)}
                  >
                    <SquarePen
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Edit
                  </DropdownMenuItem>
                )}
                {!bookmark?.archived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setOpenConfirmArchive(true)}
                  >
                    <Archive
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Archive
                  </DropdownMenuItem>
                )}
                {bookmark?.archived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setOpenConfirmArchive(true)}
                  >
                    <RotateCcw
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Unarchive
                  </DropdownMenuItem>
                )}
                {bookmark?.archived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => setOpenConfirmDelete(true)}
                  >
                    <Trash2
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Delete permanently
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator className={styles.divider} />
        <div className={styles.bookmarkContainerTopContent}>
          <p
            className={`text-preset-4-md ${styles.bookmarkContainerTopContentDescription}`}
          >
            {bookmark?.description}
          </p>
        </div>
        <div className={styles.bookmarkContainerTopContentTags}>
          {bookmark?.tags.map((t, i) => (
            <BookmarkTag key={i} label={t} />
          ))}
        </div>
      </div>
      <Separator className={styles.divider} />
      <div className={styles.bookmarkContainerBottom}>
        <Stat icon={Eye} label={`${bookmark?.visit_count}`} />
        <Stat icon={Clock} label={formatDate(bookmark?.last_visited)} />
        <Stat icon={Calendar} label={formatDate(bookmark?.created_at)} />
        {bookmark?.pinned && (
          <Pin
            height={16}
            width={16}
            className={styles.bookmarkContainerBottomPin}
          />
        )}
        {bookmark?.archived && (
          <p
            className={`text-preset-5 ${styles.bookmarkContainerBottomArchived}`}
          >
            Archived
          </p>
        )}
      </div>
    </div>
  );
}

export function formatTag(tag: string): string {
  return tag
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function BookmarkTag({ label }: { label: string }) {
  return (
    <div className={`text-preset-5 ${styles.tagContainer}`}>
      {formatTag(label)}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string | null;
}) {
  return (
    <div className={styles.bookmarkContainerBottomStat}>
      <Icon
        height={12}
        width={12}
        className={styles.bookmarkContainerBottomStatIcon}
      />
      <p className={`text-preset-5 ${styles.bookmarkContainerBottomStatText}`}>
        {label}
      </p>
    </div>
  );
}

export default Bookmark;
