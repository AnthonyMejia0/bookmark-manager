import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/bookmarks';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tagsParam = searchParams.get('tags');

  let bookmarks = getBookmarks();

  if (tagsParam) {
    const selectedTags = tagsParam.split(',');

    bookmarks = bookmarks.filter((b) =>
      b.tags.some((tag) => selectedTags.includes(tag)),
    );
  }

  return NextResponse.json({ bookmarks });
}
