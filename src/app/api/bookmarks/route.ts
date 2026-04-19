import { NextRequest, NextResponse } from 'next/server';
import { addBookmark, getBookmarks, updateBookmark } from '@/lib/bookmarks';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { Bookmark, BookmarkPost } from '@/types/bookmark';
import { HttpStatusCode } from '@/types/http';
import { PostgrestError } from '@supabase/supabase-js';

export type BookmarkResponse = {
  data: Bookmark | null;
  error: PostgrestError | string | null;
  status: HttpStatusCode;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  let bookmarks = await getBookmarks(supabase);

  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { title, url, favicon, description, tags } = await req.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: 'Unauthorized request.',
      status: HttpStatusCode.Unauthorized,
    });
  }

  if (!title || !url || !favicon || !description) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: 'Missing params.',
      status: HttpStatusCode.BadRequest,
    });
  }

  const newBookmark: BookmarkPost = {
    title,
    url,
    favicon,
    description,
    user_id: user.id,
    tags,
  };

  const { data: createdBookmark, error } = await addBookmark(
    supabase,
    newBookmark,
  );

  if (error) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: error.message,
      status: HttpStatusCode.BadRequest,
    });
  }

  return NextResponse.json<BookmarkResponse>({
    data: createdBookmark,
    error: null,
    status: HttpStatusCode.Created,
  });
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { id, title, url, description, tags, pin, archive, visit_count } =
    await req.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: 'Unauthorized request.',
      status: HttpStatusCode.Unauthorized,
    });
  }

  console.log('User Authenticated...');

  const updates: Record<string, any> = {};

  if (title?.trim()) updates.title = title.trim();
  if (url?.trim()) updates.url = url.trim();
  if (description?.trim()) updates.description = description.trim();
  if (typeof pin === 'boolean') updates.pinned = pin;
  if (typeof archive === 'boolean') updates.archived = archive;
  if (typeof visit_count === 'number') {
    updates.visit_count = visit_count;
    updates.last_visited = new Date();
  }
  if (tags != undefined) updates.tags = tags;

  const { data: updatedBookmark, error } = await updateBookmark(
    supabase,
    updates,
    id,
  );

  if (error) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: error.message,
      status: HttpStatusCode.BadRequest,
    });
  }

  return NextResponse.json<BookmarkResponse>({
    data: updatedBookmark,
    error: null,
    status: HttpStatusCode.OK,
  });
}
