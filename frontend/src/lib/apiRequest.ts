'use client';

import type { ApiRequestOptions } from '@/types/api';

export async function apiRequest<TPayload, TResponse>({
  endpoint,
  payload,
  onSuccess,
  onError,
  setBackendMessage,
  setBackendMessageType,
  setIsLoading,
  setShowNotification,
}: ApiRequestOptions<TPayload, TResponse>): Promise<void> {
  if (setIsLoading) setIsLoading(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const rawData = (await res.json()) as unknown;

    if (!res.ok) {
      const errorData = rawData as { message?: string };
      throw new Error(errorData.message || 'No error message from backend');
    }

    const successData = rawData as TResponse;
    onSuccess(successData);
  } catch (error: unknown) {
    let finalError = new Error('Unknown error');

    if (error instanceof Error) {
      finalError = error;
    }

    if (setBackendMessageType) setBackendMessageType('error');
    if (setBackendMessage) setBackendMessage(finalError.message);
    if (onError) onError(finalError);
    if (setShowNotification) setShowNotification(true);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
}
