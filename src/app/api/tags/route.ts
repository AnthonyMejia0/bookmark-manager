import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/bookmarks';
import { getTagCounts } from '@/lib/tags';

export async function GET() {
  const bookmarks = getBookmarks();
  const tags = getTagCounts(bookmarks);

  return NextResponse.json({ tags });
}
