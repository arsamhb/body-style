'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  useDeleteAdminUsersById,
  usePatchAdminUsersActiveById,
  usePatchAdminUsersById,
  usePostAdminUsers,
} from '@/app/_service/users/hook.mutation';
import { useGetAdminUsersList } from '@/app/_service/users/hook.query';
import type { UserSchema } from '@/app/_service/users/interface.schema';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import RequirePermission from '../RequirePermission';
import ConfirmDialog from '../ui/ConfirmDialog';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';
import UserForm from './UserForm';

const FORM_ID = 'user-form';

const UsersScreen = () => {
  const t = useTranslations('admin');
  const { me } = useAuth();
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useGetAdminUsersList();
  const [drawer, setDrawer] = useState<{ open: boolean; user?: UserSchema }>({ open: false });
  const [toDelete, setToDelete] = useState<UserSchema | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['get-admin-users-list'] });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  const create = usePostAdminUsers(() => {
    notify.success(t('users.created'));
    invalidate();
    closeDrawer();
  });
  const update = usePatchAdminUsersById(() => {
    notify.success(t('users.updated'));
    invalidate();
    closeDrawer();
  });
  const toggleActive = usePatchAdminUsersActiveById(() => invalidate());
  const remove = useDeleteAdminUsersById(() => {
    notify.success(t('common.deleted'));
    invalidate();
    setToDelete(null);
  });

  const saving = create.isPending || update.isPending;

  return (
    <RequirePermission developerOnly>
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setDrawer({ open: true })}
          >
            <IconByName name="plus" className="size-4" />
            {t('users.new')}
          </button>
        }
      />

      {isLoading ? (
        <Loading size="md" />
      ) : !users?.length ? (
        <EmptyState icon="users" title={t('common.noResults')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="table">
            <thead>
              <tr>
                <th>{t('users.email')}</th>
                <th>{t('users.role')}</th>
                <th>{t('users.permissions')}</th>
                <th>{t('users.status')}</th>
                <th className="text-end">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === me?.id;
                return (
                  <tr key={user.id} className="hover:bg-surface-raised/60">
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.displayName || '—'}</span>
                        <span className="text-caption text-ink-muted" dir="ltr">
                          {user.email}
                          {isSelf && <span className="ms-1">({t('users.you')})</span>}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge tone={user.role === 'developer' ? 'brand' : 'neutral'}>
                        {t(`roles.${user.role}`)}
                      </StatusBadge>
                    </td>
                    <td className="text-small text-ink-muted">
                      {user.role === 'developer'
                        ? t('users.allPermissions')
                        : user.permissions.length
                          ? t('users.permissionCount', { count: user.permissions.length })
                          : t('users.noPermissions')}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={user.isActive}
                        disabled={isSelf || toggleActive.isPending}
                        aria-label={t('users.isActive')}
                        onChange={(e) =>
                          toggleActive.mutate({ id: user.id, isActive: e.target.checked })
                        }
                      />
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={t('common.edit')}
                          onClick={() => setDrawer({ open: true, user })}
                        >
                          <IconByName name="pencil" className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-square text-danger"
                          aria-label={t('common.delete')}
                          disabled={isSelf}
                          onClick={() => setToDelete(user)}
                        >
                          <IconByName name="trash-2" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawer.open}
        onClose={closeDrawer}
        title={drawer.user ? t('users.edit') : t('users.new')}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={closeDrawer} disabled={saving}>
              {t('common.cancel')}
            </button>
            <button type="submit" form={FORM_ID} className="btn btn-primary" disabled={saving}>
              {saving && <span className="loading loading-spinner loading-xs" />}
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <UserForm
          formId={FORM_ID}
          user={drawer.user}
          isSelf={drawer.user?.id === me?.id}
          onSubmit={(values, { onError }) => {
            if (drawer.user) {
              update.mutate(
                { id: drawer.user.id, payload: values, isSelf: drawer.user.id === me?.id },
                { onError }
              );
            } else {
              create.mutate({ payload: values }, { onError });
            }
          }}
        />
      </Drawer>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('users.deleteTitle')}
        text={toDelete ? t('users.deleteText', { email: toDelete.email }) : undefined}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ id: toDelete.id })}
      />
    </RequirePermission>
  );
};

export default UsersScreen;
