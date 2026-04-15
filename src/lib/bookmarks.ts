import { SupabaseClient } from '@supabase/supabase-js';

type BookmarkTags = {
  tags: {
    name: string;
  };
};

export async function getBookmarks(sb: SupabaseClient) {
  if (!sb || sb === undefined) {
    return [];
  }

  const { data, error } = await sb.from('bookmarks').select(`
      *,
      bookmark_tags (
        tags (
          name
        )
      )
    `);

  if (error) {
    console.error('Fetch bookmarks error:', error);
    return [];
  }

  console.log('DATA =>', data);

  return (data ?? []).map((b) => ({
    ...b,
    tags: b.bookmark_tags
      .map((bt: BookmarkTags) => bt.tags?.name)
      .filter(Boolean),
  }));
}
