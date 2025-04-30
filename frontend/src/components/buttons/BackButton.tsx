'use client';

import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

import { Button } from '@/components/buttons/Button';

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({
  label = 'Back',
  href = '/',
}: BackButtonProps): JSX.Element {
  const router = useRouter();

  function handleGoBack(): void {
    router.push(href);
  }

  return (
    <Button
      type="button"
      onClick={handleGoBack}
      className="bg-[var(--secondary-bg-color)] hover:bg-[var(--secondary-hover-bg-color)] text-[var(--secondary-text-color)]"
    >
      {label}
    </Button>
  );
}
