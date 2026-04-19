import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './Bookmark.module.sass';
import { Spinner } from '@/components/ui/spinner';

type ConfirmProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  title: string;
  description: string;
  isDelete?: boolean;
  confirmationText: string;
  onConfirm: () => Promise<void>;
};

function Confirm({
  open,
  setOpen,
  loading,
  title,
  description,
  confirmationText,
  isDelete = false,
  onConfirm,
}: ConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle className={`text-preset-1 ${styles.dialogTitle}`}>
            {title}
          </DialogTitle>
          <DialogDescription
            className={`text-preset-4-md ${styles.dialogdescription}`}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        <div
          className={`${styles.dialogFormButtons} ${styles.dialogFormButtonsConfirm}`}
        >
          <DialogClose asChild>
            <button
              className={`text-preset-3 ${styles.dialogFormButtonsCancel} ${styles.dialogFormButtonsCancelConfirm}`}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className={`text-preset-3 ${styles.dialogFormButtonsAdd} ${
              styles.dialogFormButtonsAddConfirm
            } ${isDelete && styles.dialogFormButtonsAddConfirmDelete}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {!loading ? (
              confirmationText
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
      </DialogContent>
    </Dialog>
  );
}

export default Confirm;
