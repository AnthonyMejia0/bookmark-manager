import { formatTag } from '@/components/Bookmark';
import { Bookmark } from '@/types/bookmark';
import { useEffect, useState } from 'react';

export function useBookmarkDetails(bookmark?: Bookmark) {
  const [titleInput, setTitleInput] = useState(bookmark?.title ?? '');
  const [descInput, setDescInput] = useState(bookmark?.description ?? '');
  const [urlInput, setUrlInput] = useState(bookmark?.url ?? '');
  const [tagsInput, setTagsInput] = useState(
    bookmark?.tags.map(formatTag).join(', ') ?? '',
  );

  useEffect(() => {
    setTitleInput(bookmark?.title ?? '');
    setUrlInput(bookmark?.url ?? '');
    setDescInput(bookmark?.description ?? '');
    setTagsInput(bookmark?.tags.map(formatTag).join(', ') ?? '');
  }, [bookmark]);

  return {
    titleInput,
    descInput,
    urlInput,
    tagsInput,
    setTitleInput,
    setDescInput,
    setUrlInput,
    setTagsInput,
  };
}
