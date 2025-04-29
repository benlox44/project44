'use client';

import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import type { ApiMessageResponse } from '@/types/api';

interface UpdateEmailDto {
  password: string;
  newEmail: string;
}

export function EditEmailForm(): JSX.Element {
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<UpdateEmailDto, ApiMessageResponse>();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    await request({
      endpoint: '/users/me/email',
      method: 'PATCH',
      payload: { password, newEmail },
      onSuccess: () => {
        setPassword('');
        setNewEmail('');
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
            value: password,
            onChange: e => setPassword(e.target.value),
          },
          {
            label: 'New Email',
            type: 'email',
            value: newEmail,
            onChange: e => setNewEmail(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Change Email"
        loading={isLoading}
      />
    </>
  );
}
