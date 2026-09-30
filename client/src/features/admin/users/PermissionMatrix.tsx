'use client';

import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { PERMISSION_GROUPS, type PermissionKey } from '@/lib/auth/permissions';

/** next-intl treats dots as nesting, so `catalog.items` is stored as `catalog_items` in messages. */
export const permissionMessageKey = (key: PermissionKey) => key.replace('.', '_');

/** Grouped checkbox grid bound to Formik `permissions`. */
const PermissionMatrix = ({ disabled }: { disabled?: boolean }) => {
  const t = useTranslations('admin');
  const [field, , helpers] = useField<PermissionKey[]>('permissions');
  const selected = new Set(field.value ?? []);

  const toggle = (key: PermissionKey, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(key);
    else next.delete(key);
    helpers.setValue([...next]);
  };
  const toggleGroup = (keys: PermissionKey[], on: boolean) => {
    const next = new Set(selected);
    keys.forEach((k) => (on ? next.add(k) : next.delete(k)));
    helpers.setValue([...next]);
  };

  return (
    <div className="flex flex-col gap-3">
      {PERMISSION_GROUPS.map((group) => {
        const all = group.permissions.every((k) => selected.has(k));
        const some = !all && group.permissions.some((k) => selected.has(k));
        return (
          <fieldset
            key={group.key}
            className="rounded-lg border border-line bg-surface p-4"
            disabled={disabled}
          >
            <legend className="px-1">
              <label className="flex cursor-pointer items-center gap-2 text-small font-semibold">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={all}
                  ref={(el) => {
                    if (el) el.indeterminate = some;
                  }}
                  onChange={(e) => toggleGroup(group.permissions, e.target.checked)}
                />
                {t(`permissionGroups.${group.key}`)}
              </label>
            </legend>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2" role="list">
              {group.permissions.map((key) => (
                <li key={key}>
                  <label className="flex cursor-pointer items-center gap-2 text-small text-ink-muted">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selected.has(key)}
                      onChange={(e) => toggle(key, e.target.checked)}
                    />
                    {t(`permissionLabels.${permissionMessageKey(key)}`)}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
};

export default PermissionMatrix;
