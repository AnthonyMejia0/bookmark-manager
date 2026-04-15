import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/bookmarks';
import { getTagCounts } from '@/lib/tags';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const bookmarks = await getBookmarks(supabase);
  const tags = await getTagCounts(supabase, bookmarks);

  return NextResponse.json({ tags });
}
