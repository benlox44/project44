'use client';

import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { ApiMessageResponse } from '@/types/api';

interface UpdateProfileDto {
  name?: string;
}

export default function EditProfilePage(): JSX.Element {
  const { user } = useUserProfile();
  const [newName, setNewName] = useState<string>(user?.name ?? '');

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<UpdateProfileDto, ApiMessageResponse>();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    await request({
      endpoint: '/users/me',
      method: 'PATCH',
      payload: { name: newName },
      onSuccess: () => {},
    });
  }

  return (
    <PageLayout title="Edit Profile">
      {showNotification && backendMessage && (
        <Notification
          type={backendMessageType}
          message={backendMessage}
          mode="toast"
          onClose={() => setShowNotification(false)}
        />
      )}

      <SimpleForm
        fields={[
          {
            label: 'New Name',
            type: 'text',
            value: newName,
            onChange: e => setNewName(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Update Name"
        loading={isLoading}
      />
    </PageLayout>
  );
}
