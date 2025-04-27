'use client';

import { JSX, useState } from 'react';

import { BackButton } from '@/components/buttons/BackButton';
import { Button } from '@/components/buttons/Button';
import { FormInput } from '@/components/FormInput';
import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { useBackendFeedback } from '@/hooks/useBackendFeedback';
import { apiRequest } from '@/lib/apiRequest';
import type { SuccessResponse } from '@/types/common';

export default function ForgotPasswordPage(): JSX.Element {
  const {
    backendMessage,
    setBackendMessage,
    backendMessageType,
    setBackendMessageType,
    isLoading,
    setIsLoading,
    showNotification,
    setShowNotification,
  } = useBackendFeedback('warning');

  const [email, setEmail] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setBackendMessage(null);

    await apiRequest<{ email: string }, SuccessResponse>({
      endpoint: '/auth/request-password-reset',
      payload: { email },
      onSuccess: successData => {
        setBackendMessage(successData.message);
        setBackendMessageType('warning');
      },
      setBackendMessage,
      setBackendMessageType,
      setIsLoading,
      setShowNotification,
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

      <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Request password reset'}
        </Button>

        <BackButton />
      </form>
    </PageLayout>
  );
}
