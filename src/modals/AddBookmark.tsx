import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bookmark, BookmarkPost } from '@/types/bookmark';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Bookmark.module.sass';
import { useBookmarkDetails } from '@/hooks/useBookmarkDetails';
import axios from 'axios';
import { getFaviconUrl, normalizeUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { BookmarkOff, Check } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useBookmarks } from '@/hooks/useBookmarks';
import { formatTag } from '@/components/Bookmark';

type AddBookmarkProps = {
  openEdit: boolean;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  refetch: () => Promise<void>;
};

function AddBookmark({ openEdit, setOpenEdit, refetch }: AddBookmarkProps) {
  const [loading, setLoading] = useState(false);
  const formData = useBookmarkDetails();
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

  const handleAddBookmark = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.titleInput || !formData.urlInput || !formData.descInput) {
      console.log('Missing required fields');
      return;
    }

    setLoading(true);

    const tags: string[] = formData.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      const { data: newBookmark } = await axios.post('/api/bookmarks', {
        title: formData.titleInput,
        url: normalizeUrl(formData.urlInput),
        favicon: getFaviconUrl(formData.urlInput),
        description: formData.descInput,
        tags: tags,
      } as BookmarkPost);

      if (newBookmark.error) {
        console.log(newBookmark.error);
        toast('Failed to add bookmark.', {
          icon: <BookmarkOff height={20} width={20} className="toastIcon" />,
        });
        return;
      }
      formData.setTitleInput('');
      formData.setUrlInput('');
      formData.setDescInput('');
      formData.setTagsInput('');
      await refetch();

      toast('Bookmark added successfully.', {
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

  useEffect(() => {
    formData.setTitleInput('');
    formData.setUrlInput('');
    formData.setDescInput('');
    formData.setTagsInput('');
  }, [openEdit]);

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle className={`text-preset-1 ${styles.dialogTitle}`}>
            Add a Bookmark
          </DialogTitle>
          <DialogDescription
            className={`text-preset-4-md ${styles.dialogdescription}`}
          >
            Save a link with details to keep your collection organized.
          </DialogDescription>
          <form
            className={styles.dialogForm}
            onSubmit={(e) => handleAddBookmark(e)}
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
                  'Add Bookmark'
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

export default AddBookmark;
