'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import { useAuth } from '@/hooks/useAuth';
import { setFlashMessage } from '@/lib/flashMessage';
import type { ApiTokenResponse } from '@/types/api';

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
          <Link
            href="/login/forgot-password"
            className="text-sm text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline"
          >
            Forgot your password?
          </Link>
          <Link
            href="/login/request-unlock"
            className="text-sm text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline"
          >
            Unlock your account
          </Link>
        </div>
      </SimpleForm>
    </PageLayout>
  );
}
