'use client';

import { Tag as TagType } from '@/types/tag';
import styles from './Tag.module.sass';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';

type TagProps = {
  tag: TagType;
  toggleTag: (tag: string) => void;
};

function Tag({ tag, toggleTag }: TagProps) {
  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked(!checked);
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
          />
          <FieldLabel className={`text-preset-3 ${styles.checkboxLabel}`}>
            {tag.name}
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
