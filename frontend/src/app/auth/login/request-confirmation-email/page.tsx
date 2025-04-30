'use client';

import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import type { ApiMessageResponse } from '@/types/api';

interface RequestConfirmationEmailDto {
  email: string;
}

export default function RequestConfirmationEmailPage(): JSX.Element {
  const [email, setEmail] = useState('');

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<
    RequestConfirmationEmailDto,
    ApiMessageResponse
  >();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    await request({
      endpoint: '/auth/request-confirmation-email',
      method: 'POST',
      payload: { email },
      onSuccess: () => {},
    });
  }

  return (
    <PageLayout title="Resend Confirmation Email">
      {showNotification && backendMessage && (
        <Notification
          type={backendMessageType === 'success' ? 'info' : backendMessageType}
          message={backendMessage}
          mode="toast"
          onClose={() => setShowNotification(false)}
        />
      )}

      <SimpleForm
        fields={[
          {
            label: 'Email',
            type: 'email',
            value: email,
            onChange: e => setEmail(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Send Confirmation Link"
        loading={isLoading}
        backHref="/auth/login"
      />
    </PageLayout>
  );
}
