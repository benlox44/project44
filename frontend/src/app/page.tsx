'use client';

import Link from 'next/link';
import { useEffect, useState, JSX } from 'react';

import { Button } from '../components/buttons/Button';
import { LogoutButton } from '../components/buttons/LogoutButton';
import { Notification } from '../components/Notification';
import { PageLayout } from '@/components/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getFlashMessage, clearFlashMessage } from '@/lib/flashMessage';

export default function Home(): JSX.Element {
  const { isLoggedIn, userEmail, logout } = useAuth();
  const { user, loading: userLoading } = useUserProfile();
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const { message, type } = getFlashMessage();
    if (message) {
      setFlashMessage(message);
      setFlashType(type);
      clearFlashMessage();
    }
  }, []);

  const title = isLoggedIn
    ? userLoading
      ? 'Loading user...'
      : user?.name
      ? `Hello ${user.name}`
      : `Hello ${userEmail}`
    : 'Hello World';

  return (
    <PageLayout title={title}>
      {flashMessage && (
        <Notification
          message={flashMessage}
          type={flashType}
          mode="toast"
          onClose={() => setFlashMessage(null)}
        />
      )}

      {isLoggedIn ? (
        <div>
          <Link href="/user/edit-profile">
            <Button>Edit Profile</Button>
          </Link>
          <LogoutButton onLogout={logout} />
        </div>
      ) : (
        <div>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </PageLayout>
  );
}
