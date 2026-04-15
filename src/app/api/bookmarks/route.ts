import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/bookmarks';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  let bookmarks = await getBookmarks(supabase);

  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {}
