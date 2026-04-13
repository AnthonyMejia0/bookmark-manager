'use client';

import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { useEffect, useMemo, useState } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const bookmarksResponse = await fetch('/api/bookmarks');
        const bookmarksData = await bookmarksResponse.json();

        const tagsResponse = await fetch('/api/tags');
        const tagsData = await tagsResponse.json();

        setBookmarks(bookmarksData.bookmarks);
        setTags(tagsData.tags);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // FILTER BOOKMARKS
  // -------------------------
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    // remove archived
    filtered = filtered.filter((b) => !b.isArchived);

    // tag filtering (OR logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        b.tags.some((tag) => selectedTags.includes(tag)),
      );
    }

    return filtered;
  }, [bookmarks, selectedTags]);

  // -------------------------
  // TOGGLE TAG
  // -------------------------
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // -------------------------
  // CLEAR FILTERS
  // -------------------------
  const clearTags = () => setSelectedTags([]);

  return {
    bookmarks,
    tags,
    selectedTags,
    setSelectedTags,
    toggleTag,
    clearTags,
    filteredBookmarks,
    loading,
  };
}
