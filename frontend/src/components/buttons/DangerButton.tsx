'use client';

import { JSX, useState } from 'react';

import { Button } from './Button';

interface DangerButtonProps {
  onConfirm: () => void | Promise<void>;
  children: React.ReactNode;
  confirmText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
}

export function DangerButton({
  onConfirm,
  children,
  confirmText = 'Are you sure? This action cannot be undone.',
  confirmButtonText = 'Yes, confirm',
  cancelButtonText = 'Cancel',
  loading = false,
}: DangerButtonProps): JSX.Element {
  const [confirming, setConfirming] = useState(false);

  return (
    <div>
      {!confirming ? (
        <Button
          onClick={() => setConfirming(true)}
          className="bg-[var(--destructive-bg-color)] hover:bg-[var(--destructive-hover-bg-color)] text-[var(--button-text-color)]"
        >
          {children}
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-[var(--confirmation-text-color)]">
            {confirmText}
          </p>
          <Button
            onClick={() => {
              void onConfirm();
            }}
            className="bg-[var(--destructive-bg-color)] hover:bg-[var(--destructive-hover-bg-color)] text-[var(--button-text-color)]"
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmButtonText}
          </Button>
          <Button onClick={() => setConfirming(false)}>
            {cancelButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
