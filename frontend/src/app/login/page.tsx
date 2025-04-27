'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';

import { Button } from '../../components/buttons/Button';
import { FormInput } from '../../components/FormInput';
import { Notification } from '../../components/Notification';
import { BackButton } from '@/components/buttons/BackButton';
import { PageLayout } from '@/components/PageLayout';
import { useBackendFeedback } from '@/hooks/useBackendFeedback';
import { apiRequest } from '@/lib/apiRequest';
import { setFlashMessage } from '@/lib/flashMessage';

interface LoginResponse {
  access_token: string;
}

export default function LoginPage(): JSX.Element {
  const router = useRouter();

  const {
    backendMessage,
    setBackendMessage,
    backendMessageType,
    setBackendMessageType,
    isLoading,
    setIsLoading,
    showNotification,
    setShowNotification,
  } = useBackendFeedback('success');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setBackendMessage(null);

    await apiRequest<{ email: string; password: string }, LoginResponse>({
      endpoint: '/auth/login',
      payload: { email, password },
      onSuccess: loginData => {
        localStorage.setItem('access_token', loginData.access_token);
        setFlashMessage('Logged in successfully!', 'success');
        router.push('/');
      },
      setBackendMessage,
      setBackendMessageType,
      setIsLoading,
      setShowNotification,
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

      <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </Button>

        <div className="flex flex-col items-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
          <Link
            href="/request-unlock"
            className="text-sm text-blue-600 hover:underline"
          >
            Unlock your account
          </Link>
        </div>

        <BackButton />
      </form>
    </PageLayout>
  );
}
