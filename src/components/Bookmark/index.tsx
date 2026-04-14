'use client';

import { Bookmark as BookmarkType } from '@/types/bookmark';
import styles from './Bookmark.module.sass';
import { Separator } from '../ui/separator';
import Image from 'next/image';
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
  RotateCcw,
  SquareArrowOutUpRight,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

type BookmarkComponentProps = {
  bookmark: BookmarkType;
};

function Bookmark({ bookmark }: BookmarkComponentProps) {
  const formatDate = (date: string | null) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={styles.bookmarkContainer}>
      <div className={styles.bookmarkContainerTop}>
        <div className={styles.bookmarkContainerTopHeader}>
          <div className={styles.bookmarkContainerTopHeaderIcon}>
            {bookmark?.favicon && (
              <Image
                src={bookmark?.favicon}
                alt="Bookmark Icon"
                height={28}
                width={28}
              />
            )}
          </div>
          <div className={styles.bookmarkContainerTopHeaderDetails}>
            <p
              className={`text-preset-2 ${styles.bookmarkContainerTopHeaderDetailsTitle}`}
            >
              {bookmark?.title}
            </p>
            {bookmark?.url && (
              <p
                className={`text-preset-5 ${styles.bookmarkContainerTopHeaderDetailsUrl}`}
                // TODO - Handle updating visitCount and lastVisited
                onClick={() => console.log('link clicked')}
              >
                {bookmark?.url.replace(/^https?:\/\//, '')}
              </p>
            )}
          </div>
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
                    onClick={() => {}}
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
                  onClick={() => {
                    navigator.clipboard.writeText(bookmark?.url);
                  }}
                >
                  <Copy
                    height={16}
                    width={16}
                    className={styles.menuOptionIcon}
                  />
                  Copy URL
                </DropdownMenuItem>
                {!bookmark?.isArchived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => {}}
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
                {!bookmark?.isArchived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => {}}
                  >
                    <SquarePen
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Edit
                  </DropdownMenuItem>
                )}
                {!bookmark?.isArchived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => {}}
                  >
                    <Archive
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Archive
                  </DropdownMenuItem>
                )}
                {bookmark?.isArchived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => {}}
                  >
                    <RotateCcw
                      height={16}
                      width={16}
                      className={styles.menuOptionIcon}
                    />
                    Unarchive
                  </DropdownMenuItem>
                )}
                {bookmark?.isArchived && (
                  <DropdownMenuItem
                    className={`text-preset-4 ${styles.menuOption}`}
                    onClick={() => {}}
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
        <Stat icon={Eye} label={`${bookmark?.visitCount}`} />
        <Stat icon={Clock} label={formatDate(bookmark?.lastVisited)} />
        <Stat icon={Calendar} label={formatDate(bookmark?.createdAt)} />
        {bookmark?.pinned && (
          <Pin
            height={16}
            width={16}
            className={styles.bookmarkContainerBottomPin}
          />
        )}
        {bookmark?.isArchived && (
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

function BookmarkTag({ label }: { label: string }) {
  return <div className={`text-preset-5 ${styles.tagContainer}`}>{label}</div>;
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
