'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { TextLink } from '@/components/TextLink';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import { useAuth } from '@/hooks/useAuth';
import {
  getFlashMessage,
  clearFlashMessage,
  setFlashMessage,
} from '@/lib/flashMessage';
import type { ApiTokenResponse } from '@/types/api';
import type { MessageType } from '@/types/common';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const { login } = useAuth();

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<
    { email: string; password: string },
    ApiTokenResponse
  >();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [flashMessage, setFlashMessageState] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<MessageType>('success');

  useEffect(() => {
    const { message, type } = getFlashMessage();
    if (message) {
      setFlashMessageState(message);
      setFlashType(type);
      clearFlashMessage();
    }
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    await request({
      endpoint: '/auth/login',
      method: 'POST',
      payload: { email, password },
      onSuccess: loginData => {
        login(loginData.access_token);
        setFlashMessage('Logged in successfully!', 'success');
        void router.push('/');
      },
    });
  }

  return (
    <PageLayout title="Login">
      {showNotification && backendMessage && (
        <Notification
          type={backendMessageType}
          message={backendMessage}
          mode="toast"
          onClose={() => setShowNotification(false)}
        />
      )}

      {flashMessage && (
        <Notification
          type={flashType}
          message={flashMessage}
          mode="toast"
          onClose={() => setFlashMessageState(null)}
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
          {
            label: 'Password',
            type: 'password',
            value: password,
            onChange: e => setPassword(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Login"
        loading={isLoading}
        backHref="/"
      >
        <div className="flex flex-col items-center space-y-2">
          <TextLink href="/auth/login/forgot-password">
            Forgot your password?
          </TextLink>
          <TextLink href="/auth/login/request-unlock">
            Unlock your account
          </TextLink>
          <TextLink href="/auth/login/request-confirmation-email">
            Resend confirmation email
          </TextLink>
        </div>
      </SimpleForm>
    </PageLayout>
  );
}
