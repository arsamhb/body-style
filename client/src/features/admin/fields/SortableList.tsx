'use client';

import { FieldArray, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import IconByName from '@/shared/UI/IconByName';
import EmptyState from '../ui/EmptyState';

interface SortableListProps<T> {
  name: string;
  items: T[];
  newItem: () => T;
  renderItem: (index: number, item: T) => React.ReactNode;
  /** Short caption for the row header, e.g. the item label. */
  itemTitle?: (item: T, index: number) => string;
  addLabel?: string;
  max?: number;
}

/**
 * Ordered list editor bound to a Formik array: add, remove, move up/down. Order is the array
 * index (adapters write it into `order`). No drag-and-drop on purpose: keyboard-friendly, RTL-safe.
 */
function SortableList<T>({
  name,
  items,
  newItem,
  renderItem,
  itemTitle,
  addLabel,
  max = 50,
}: SortableListProps<T>) {
  const t = useTranslations('admin.fields');
  const { setFieldValue } = useFormikContext();
  return (
    <FieldArray name={name}>
      {({ push, remove, swap }) => (
        <div className="flex flex-col gap-3">
          {items.length === 0 && <EmptyState icon="list" title={t('noItems')} />}
          {items.map((item, index) => (
            <div
              key={(item as { id?: string }).id ?? index}
              className="rounded-lg border border-line bg-surface"
            >
              <div className="flex items-center gap-1 border-b border-line px-3 py-2">
                <span className="grid size-6 place-items-center rounded-sm bg-surface-raised text-caption font-semibold text-ink-muted">
                  {index + 1}
                </span>
                <span className="truncate text-small font-medium">{itemTitle?.(item, index)}</span>
                <div className="ms-auto flex gap-0.5">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label={t('moveUp')}
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                  >
                    <IconByName name="arrow-up" className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label={t('moveDown')}
                    disabled={index === items.length - 1}
                    onClick={() => swap(index, index + 1)}
                  >
                    <IconByName name="arrow-down" className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square text-danger"
                    aria-label={t('remove')}
                    onClick={() => remove(index)}
                  >
                    <IconByName name="trash-2" className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4">{renderItem(index, item)}</div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline btn-sm w-fit"
            disabled={items.length >= max}
            onClick={() => {
              push(newItem());
              void setFieldValue;
            }}
          >
            <IconByName name="plus" className="size-4" />
            {addLabel ?? t('addItem')}
          </button>
        </div>
      )}
    </FieldArray>
  );
}

export default SortableList;
