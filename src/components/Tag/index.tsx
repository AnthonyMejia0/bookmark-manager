'use client';

import { Tag as TagType } from '@/types/tag';
import styles from './Tag.module.sass';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';

type TagProps = {
  tag: TagType;
  toggleTag: (tag: string) => void;
  selectedTags: string[];
};

function Tag({ tag, toggleTag, selectedTags }: TagProps) {
  const [checked, setChecked] = useState(selectedTags.includes(tag.name));

  useEffect(() => {
    setChecked(selectedTags.includes(tag.name));
  }, [selectedTags]);

  function formatTagName(tag: string) {
    return tag
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const handleChecked = () => {
    toggleTag(tag.name);
  };

  return (
    <div className={styles.tagContainer}>
      <FieldGroup className="mx-auto w-56">
        <Field orientation="horizontal">
          <Checkbox
            className={styles.checkbox}
            checked={checked}
            onCheckedChange={handleChecked}
            style={{ cursor: 'pointer' }}
          />
          <FieldLabel className={`text-preset-3 ${styles.checkboxLabel}`}>
            {formatTagName(tag?.name)}
          </FieldLabel>
        </Field>
      </FieldGroup>
      <div className={styles.checkboxNumber}>
        <p className={`text-preset-5 ${styles.checkboxNumberText}`}>
          {tag.count}
        </p>
      </div>
    </div>
  );
}

export default Tag;
