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

    switch (sortBy) {
      case 'recently added':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;

      case 'recently visited':
        result.sort(
          (a, b) =>
            new Date(b.last_visited ?? 0).getTime() -
            new Date(a.last_visited ?? 0).getTime(),
        );
        break;

      case 'most visited':
        result.sort((a, b) => (b.visit_count ?? 0) - (a.visit_count ?? 0));
        break;
    }

    return result;
  }, [bookmarks, selectedTags, sortBy, searchInput]);

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
    toggleTag,
    clearTags,
    filteredBookmarks,
    loading,
    refetch: fetchData,
  };
}
