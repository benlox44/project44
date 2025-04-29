'use client';

import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import type { ApiMessageResponse } from '@/types/api';

interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export function EditPasswordForm(): JSX.Element {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<UpdatePasswordDto, ApiMessageResponse>();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    await request({
      endpoint: '/users/me/password',
      method: 'PATCH',
      payload: { currentPassword, newPassword },
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
      },
    });
  }

  return (
    <>
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
            label: 'Current Password',
            type: 'password',
            value: currentPassword,
            onChange: e => setCurrentPassword(e.target.value),
          },
          {
            label: 'New Password',
            type: 'password',
            value: newPassword,
            onChange: e => setNewPassword(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Change Password"
        loading={isLoading}
      />
    </>
  );
}
