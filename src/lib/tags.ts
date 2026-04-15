import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { SupabaseClient } from '@supabase/supabase-js';

// export async function getTagCounts(sb: SupabaseClient, bookmarks: Bookmark[]) {
//   const counts: Record<string, number> = {};

//   console.log('Tags API Bookmarks =>', bookmarks);

//   for (const b of bookmarks) {
//     const { data, error } = await sb
//   .from('bookmark_tags')
//   .select(`
//     tags (
//       name
//     )
//   `)
//   .in(
//     'bookmark_id',
//     bookmarks.map((b) => b.id)
//   );

//     console.log(`${b.id} Tags =>`, data);

//     if (error) {
//       console.log('Fetch tags error: ', error);
//       return [];
//     }
//   }

//   return Object.entries(counts)
//     .map(([name, count]) => ({ name, count }))
//     .sort((a, b) => a.name.localeCompare(b.name));
// }

type BookmarkTagRow = {
  tags: {
    name: string;
  } | null;
};

export async function getTagCounts(sb: SupabaseClient, bookmarks: Bookmark[]) {
  if (!bookmarks.length) return [];

  const counts: Record<string, number> = {};

  const bookmarkIds = bookmarks.map((b) => b.id);

  const { data, error } = await sb
    .from('bookmark_tags')
    .select(
      `
      tags (
        name
      )
    `,
    )
    .in('bookmark_id', bookmarkIds)
    .overrideTypes<BookmarkTagRow[]>();

  if (error) {
    console.error('Fetch tag counts error:', error);
    return [];
  }

  for (const row of data ?? []) {
    const tagName = row.tags?.name;

    if (!tagName) continue;

    counts[tagName] = (counts[tagName] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
