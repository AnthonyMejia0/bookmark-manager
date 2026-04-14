import { Bookmark } from '@/types/bookmark';

export function getTagCounts(bookmarks: Bookmark[]) {
  const counts: Record<string, number> = {};

  for (const b of bookmarks) {
    // if (b.isArchived) continue;

    for (const tag of b.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
