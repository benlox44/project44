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
      className="bg-[var(--logout-bg-color)] hover:bg-[var(--logout-hover-bg-color)] text-[var(--logout-text-color)]"
    >
      Logout
    </Button>
  );
}
