'use client';

export function setFlashMessage(
  message: string,
  type: 'success' | 'error' = 'success',
): void {
  localStorage.setItem('flash_message', message);
  localStorage.setItem('flash_type', type);
}

export function getFlashMessage(): {
  message: string | null;
  type: 'success' | 'error';
} {
  const message = localStorage.getItem('flash_message');
  const type =
    (localStorage.getItem('flash_type') as 'success' | 'error') || 'success';
  return { message, type };
}

export function clearFlashMessage(): void {
  localStorage.removeItem('flash_message');
  localStorage.removeItem('flash_type');
}
