'use client';

import { useRouter } from 'next/navigation';
import { JSX } from 'react';

import { DangerButton } from '@/components/buttons/DangerButton';
import { Notification } from '@/components/Notification';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import { useAuth } from '@/hooks/useAuth';
import { setFlashMessage } from '@/lib/flashMessage';
import type { ApiMessageResponse } from '@/types/api';

export function DeleteAccountButton(): JSX.Element {
  const router = useRouter();
  const { logout } = useAuth();

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<undefined, ApiMessageResponse>();

  async function handleDelete(): Promise<void> {
    await request({
      endpoint: '/users/me',
      method: 'DELETE',
      onSuccess: () => {
        logout();
        setFlashMessage('Your account was deleted.', 'success');
        void router.push('/');
      },
    });
  }

  return (
    <div className="space-y-4">
      {showNotification && backendMessage && (
        <Notification
          type={backendMessageType}
          message={backendMessage}
          mode="toast"
          onClose={() => setShowNotification(false)}
        />
      )}

      <DangerButton onConfirm={handleDelete} loading={isLoading}>
        Delete Account
      </DangerButton>
    </div>
  );
}
