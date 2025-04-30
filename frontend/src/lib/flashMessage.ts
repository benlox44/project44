'use client';

import type { MessageType } from '@/types/common';

export function setFlashMessage(
  message: string,
  type: MessageType = 'success',
): void {
  localStorage.setItem('flash_message', message);
  localStorage.setItem('flash_type', type);
}

export function getFlashMessage(): {
  message: string | null;
  type: MessageType;
} {
  const message = localStorage.getItem('flash_message');
  const type = (localStorage.getItem('flash_type') as MessageType) || 'success';
  return { message, type };
}

export function clearFlashMessage(): void {
  localStorage.removeItem('flash_message');
  localStorage.removeItem('flash_type');
}
