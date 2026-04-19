import { Bookmark, BookmarkPost } from '@/types/bookmark';
import { SupabaseClient } from '@supabase/supabase-js';

const bookmarksTable = 'bookmarks';

export async function getBookmarks(sb: SupabaseClient) {
  if (!sb || sb === undefined) {
    return [];
  }

  const { data, error } = await sb.from(bookmarksTable).select(`*`);

  if (error) {
    console.error('Fetch bookmarks error:', error);
    return [];
  }

  return data ?? [];
}

export async function addBookmark(sb: SupabaseClient, bookmark: BookmarkPost) {
  const { data: newBookmark, error } = await sb
    .from(bookmarksTable)
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

export async function updateBookmark(
  sb: SupabaseClient,
  updates: Record<string, any>,
  id: string,
) {
  const { data: updatedBookmark, error } = await sb
    .from(bookmarksTable)
    .update(updates)
    .eq('id', id);

  if (error) {
    console.log('Error updating bookmark');
    return {
      data: null,
      error: error,
    };
  }

  return {
    data: updatedBookmark,
    error: null,
  };
}

export async function deleteBookmark(sb: SupabaseClient, id: string) {
  const { data, error } = await sb
    .from(bookmarksTable)
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: error,
    };
  }

  return {
    data,
    error: null,
  };
}
