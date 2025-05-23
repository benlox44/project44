'use client';

import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import type { ApiMessageResponse } from '@/types/api';

export default function ForgotPasswordPage(): JSX.Element {
  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<{ email: string }, ApiMessageResponse>();

  const [email, setEmail] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    await request({
      endpoint: '/auth/request-password-reset',
      method: 'POST',
      payload: { email },
      onSuccess: () => {},
      successMessageType: 'info',
    });
  }

  return (
    <PageLayout title="Forgot Password">
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
            label: 'Email',
            type: 'email',
            value: email,
            onChange: e => setEmail(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Request password reset"
        loading={isLoading}
        backHref="/auth/login"
      />
    </PageLayout>
  );
}
