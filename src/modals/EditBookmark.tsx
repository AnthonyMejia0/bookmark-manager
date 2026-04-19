import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './Bookmark.module.sass';
import { Spinner } from '@/components/ui/spinner';
import { Bookmark, BookmarkPut } from '@/types/bookmark';
import { useBookmarkDetails } from '@/hooks/useBookmarkDetails';
import axios from 'axios';
import { getFaviconUrl, normalizeUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { BookmarkOff, Check } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { formatTag } from '@/components/Bookmark';

type EditBookmarkProps = {
  openEdit: boolean;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  bookmark: Bookmark;
  refetch: () => Promise<void>;
};

function EditBookmark({
  openEdit,
  setOpenEdit,
  bookmark,
  refetch,
}: EditBookmarkProps) {
  const [loading, setLoading] = useState(false);
  const formData = useBookmarkDetails(bookmark);
  const { tags } = useBookmarks();

  const parts = formData.tagsInput.split(',');
  const currentTag = parts[parts.length - 1].trim().toLowerCase();

  const suggestions = tags.filter(
    (tag) =>
      tag.name.startsWith(currentTag.toLowerCase()) &&
      currentTag.length > 0 &&
      !parts.map((t) => t.trim().toLowerCase()).includes(tag.name),
  );

  function handleSelectTag(tag: string) {
    const parts = formData.tagsInput.split(',');

    const formattedTag = formatTag(tag);

    parts[parts.length - 1] = ` ${formattedTag}`;

    formData.setTagsInput(parts.join(',').replace(/^ /, ''));
  }

  const handleEditBookmark = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.titleInput || !formData.descInput) {
      console.log('Missing required fields');
      return;
    }

    setLoading(true);

    const tags: string[] = formData.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      const { data: updatedBookmark } = await axios.put('/api/bookmarks', {
        id: bookmark.id,
        title: formData.titleInput,
        url: normalizeUrl(formData.urlInput),
        favicon: getFaviconUrl(formData.urlInput),
        description: formData.descInput,
        tags: tags,
      } as BookmarkPut);

      if (updatedBookmark.error) {
        console.log(updatedBookmark.error);
        toast('Failed to update bookmark.', {
          icon: <BookmarkOff height={20} width={20} className="toastIcon" />,
        });
        return;
      }

      await refetch();

      toast('Changes saved.', {
        icon: <Check height={20} width={20} className="toastIcon" />,
      });
    } catch (error) {
      console.log('Failed to add bookmark:', error);
      toast('Failed to add bookmark.', {
        icon: <BookmarkOff height={20} width={20} className="toastIcon" />,
      });
    } finally {
      setOpenEdit(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle className={`text-preset-1 ${styles.dialogTitle}`}>
            Edit Bookmark
          </DialogTitle>
          <DialogDescription
            className={`text-preset-4-md ${styles.dialogdescription}`}
          >
            Update your saved link details - change the title, description, URL,
            or tags anytime.
          </DialogDescription>
          <form
            className={styles.dialogForm}
            onSubmit={(e) => handleEditBookmark(e)}
          >
            <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
              Title <span className={styles.dialogFormLabelStar}>*</span>
            </label>
            <input
              type="text"
              className={`text-preset-4-md ${styles.dialogFormInput}`}
              value={formData.titleInput}
              onChange={(e) => formData.setTitleInput(e.target.value)}
              required
            />

            <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
              Description <span className={styles.dialogFormLabelStar}>*</span>
            </label>
            <textarea
              className={`text-preset-4-md ${styles.dialogFormInput} ${styles.dialogFormInputArea}`}
              maxLength={280}
              value={formData.descInput}
              onChange={(e) => formData.setDescInput(e.target.value)}
              required
            />
            <p className={`text-preset-5 ${styles.dialogFormCounter}`}>
              {formData.descInput.length} / 280
            </p>

            <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
              Website URL <span className={styles.dialogFormLabelStar}>*</span>
            </label>
            <input
              type="text"
              className={`text-preset-4-md ${styles.dialogFormInput}`}
              value={formData.urlInput}
              onChange={(e) => formData.setUrlInput(e.target.value)}
              required
            />

            <label className={`text-preset-4 ${styles.dialogFormLabel}`}>
              Tags <span className={styles.dialogFormLabelStar}>*</span>
            </label>
            <div className={styles.tagSuggestions}>
              <input
                type="text"
                className={`text-preset-4-md ${styles.dialogFormInput}`}
                value={formData.tagsInput}
                onChange={(e) => formData.setTagsInput(e.target.value)}
                placeholder="e.g. design, learning, tools"
                required
              />

              {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.slice(0, 5).map((tag) => (
                    <li
                      key={tag.name}
                      onClick={() => handleSelectTag(tag.name)}
                      className={styles.suggestionsItem}
                    >
                      {formatTag(tag.name)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.dialogFormButtons}>
              <DialogClose asChild>
                <button
                  className={`text-preset-3 ${styles.dialogFormButtonsCancel}`}
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                className={`text-preset-3 ${styles.dialogFormButtonsAdd}`}
                type="submit"
                disabled={loading}
              >
                {!loading ? (
                  'Save Bookmark'
                ) : (
                  <Spinner
                    height={20}
                    width={20}
                    style={{
                      marginInline: 'auto',
                    }}
                  />
                )}
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookmark;
