import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/bookmarks';
import { addTags, getTagCounts } from '@/lib/tags';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { HttpStatusCode } from '@/types/http';
import { BookmarkTag } from '@/types/bookmark';

export type TagResponse = {
  data: BookmarkTag[] | null;
  error: string | null;
  status: HttpStatusCode;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const bookmarks = await getBookmarks(supabase);
  const tags = await getTagCounts(supabase, bookmarks);

  return NextResponse.json({ tags });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { tags, bookmarkId } = await req.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json<TagResponse>({
      data: null,
      error: 'Unauthorized request.',
      status: HttpStatusCode.Unauthorized,
    });
  }

  if (!tags || !bookmarkId) {
    return NextResponse.json<TagResponse>({
      data: null,
      error: 'Missing params.',
      status: HttpStatusCode.BadRequest,
    });
  }

  const addedTags = await addTags(supabase, tags, bookmarkId);

  return NextResponse.json<TagResponse>({
    data: addedTags,
    error: null,
    status: HttpStatusCode.Created,
  });
}
