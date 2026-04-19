'use client';

import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { useEffect, useMemo, useState } from 'react';

type SortTypes = 'recently added' | 'recently visited' | 'most visited';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<SortTypes>('recently added');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTags = (bookmarkData: Bookmark[]) => {
    const tagCounts: Record<string, number> = {};

    for (const b of bookmarkData) {
      for (const t of b.tags) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const fetchData = async () => {
    console.log('Fetching data...');
    try {
      setLoading(true);

      const bookmarksResponse = await fetch('/api/bookmarks');
      const bookmarksData = await bookmarksResponse.json();

      const tagsData = fetchTags(bookmarksData.bookmarks);

      setBookmarks(bookmarksData.bookmarks);
      setTags(tagsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    if (showArchived) {
      result = result.filter((b) => b.archived);
    } else {
      result = result.filter((b) => !b.archived);
    }

    if (selectedTags.length > 0 && !searchInput) {
      result = result.filter((b) =>
        b.tags.some((tag) => selectedTags.includes(tag)),
      );
    }

    if (searchInput) {
      result = result.filter((b) => {
        let lowerB = b.title.toLowerCase();
        return lowerB.startsWith(searchInput.toLowerCase());
      });
    }

    result.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      switch (sortBy) {
        case 'recently added':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        case 'recently visited':
          return (
            new Date(b.last_visited ?? 0).getTime() -
            new Date(a.last_visited ?? 0).getTime()
          );

        case 'most visited':
          return (b.visit_count ?? 0) - (a.visit_count ?? 0);

        default:
          return 0;
      }
    });

    return result;
  }, [bookmarks, selectedTags, sortBy, searchInput, showArchived]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearTags = () => setSelectedTags([]);

  return {
    bookmarks,
    tags,
    selectedTags,
    setSelectedTags,
    searchInput,
    setSearchInput,
    sortBy,
    setSortBy,
    showArchived,
    setShowArchived,
    toggleTag,
    clearTags,
    filteredBookmarks,
    loading,
    refetch: fetchData,
  };
}
