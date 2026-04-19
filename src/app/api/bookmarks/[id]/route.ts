import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { NextResponse } from 'next/server';
import { BookmarkResponse } from '../route';
import { HttpStatusCode } from '@/types/http';
import { deleteBookmark } from '@/lib/bookmarks';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

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

  if (!id) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: 'Missing params.',
      status: HttpStatusCode.BadRequest,
    });
  }

  const { data: deletedBookmark, error } = await deleteBookmark(supabase, id);

  if (error) {
    return NextResponse.json<BookmarkResponse>({
      data: null,
      error: error.message,
      status: HttpStatusCode.BadRequest,
    });
  }

  return NextResponse.json<BookmarkResponse>({
    data: deletedBookmark,
    error: null,
    status: HttpStatusCode.OK,
  });
}
