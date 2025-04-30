'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { JSX } from 'react';

import { Notification } from '@/components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { SimpleForm } from '@/components/SimpleForm';
import { useApiRequestWithMessages } from '@/hooks/useApiRequestWithMessages';
import { setFlashMessage } from '@/lib/flashMessage';
import type { ApiMessageResponse } from '@/types/api';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  } = useApiRequestWithMessages<CreateUserDto, ApiMessageResponse>();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setLocalError(null);

    await request({
      endpoint: '/auth',
      method: 'POST',
      payload: formData,
      onSuccess: (response: ApiMessageResponse) => {
        if (response.message) {
          setFlashMessage(response.message, 'info');
        }
        router.push('/auth/login');
      },
    });
  }

  return (
    <PageLayout title="Register">
      {(showNotification && backendMessage) || localError ? (
        <Notification
          type={localError ? 'error' : backendMessageType}
          message={localError ?? backendMessage!}
          mode="toast"
          onClose={() => {
            setShowNotification(false);
            setLocalError(null);
          }}
        />
      ) : null}

      <SimpleForm
        fields={[
          {
            label: 'Name',
            type: 'text',
            value: formData.name,
            onChange: e => setFormData({ ...formData, name: e.target.value }),
          },
          {
            label: 'Email',
            type: 'email',
            value: formData.email,
            onChange: e => setFormData({ ...formData, email: e.target.value }),
          },
          {
            label: 'Password',
            type: 'password',
            value: formData.password,
            onChange: e =>
              setFormData({ ...formData, password: e.target.value }),
          },
          {
            label: 'Confirm Password',
            type: 'password',
            value: confirmPassword,
            onChange: e => setConfirmPassword(e.target.value),
          },
        ]}
        onSubmit={e => void handleSubmit(e)}
        submitButtonText="Create Account"
        loading={isLoading}
        backHref="/"
      />
    </PageLayout>
  );
}
