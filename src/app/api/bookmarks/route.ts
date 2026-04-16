import { NextResponse } from 'next/server';
import { addBookmark, getBookmarks } from '@/lib/bookmarks';
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
  const { title, url, favicon, description } = await req.json();
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
