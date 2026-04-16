import { BookmarkPost } from '@/types/bookmark';
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

  const { data, error } = await sb.from('bookmarks').select(`*`);

  if (error) {
    console.error('Fetch bookmarks error:', error);
    return [];
  }

  return data ?? [];
}

export async function addBookmark(sb: SupabaseClient, bookmark: BookmarkPost) {
  const { data: newBookmark, error } = await sb
    .from('bookmarks')
    .insert<BookmarkPost>({
      title: bookmark.title,
      url: bookmark.url,
      favicon: bookmark.favicon,
      description: bookmark.description,
      user_id: bookmark.user_id,
      tags: bookmark.tags,
    })
    .select()
    .single();

  if (error) {
    console.log('Error creating bookmark');
    return {
      data: null,
      error,
    };
  }

  return {
    data: newBookmark,
    error: null,
  };
}
