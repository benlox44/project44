'use client';

import { JSX } from 'react';

import { Button } from './Button';

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps): JSX.Element {
  function handleLogout(): void {
    localStorage.removeItem('access_token');
    onLogout();
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-[var(--destructive-bg-color)] hover:bg-[var(--destructive-hover-bg-color)]"
    >
      Logout
    </Button>
  );
}
