'use client';

import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

import { Button } from '../components/buttons/Button';
import { LogoutButton } from '../components/buttons/LogoutButton';
import { Notification } from '../components/Notification';
import { getFlashMessage, clearFlashMessage } from '@/lib/flashMessage';

export default function Home(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<'success' | 'error'>('success');

  function checkAuth(): void {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }

  useEffect(() => {
    checkAuth();

    const { message, type } = getFlashMessage();
    if (message) {
      setFlashMessage(message);
      setFlashType(type);
      clearFlashMessage();
    }

    window.addEventListener('storage', checkAuth);

    return (): void => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-4xl font-bold">Hello World</h1>

      {flashMessage && (
        <Notification
          message={flashMessage}
          type={flashType}
          mode="toast"
          onClose={() => setFlashMessage(null)}
        />
      )}

      <div className="flex flex-col space-y-4 w-40">
        {isLoggedIn ? (
          <LogoutButton onLogout={checkAuth} />
        ) : (
          <>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
