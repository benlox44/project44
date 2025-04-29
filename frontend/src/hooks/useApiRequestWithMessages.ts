'use client';

import { useState } from 'react';

import { apiRequest } from '@/lib/api/apiRequest';
import type { ApiRequestOptions } from '@/types/api';
import type { MessageType } from '@/types/common';

function hasMessage(response: unknown): response is { message: string } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    typeof (response as { message: unknown }).message === 'string'
  );
}

interface UseApiRequestWithMessagesOptions<TPayload, TResponse>
  extends ApiRequestOptions<TPayload> {
  onSuccess: (response: TResponse) => void;
  onError?: (error: Error) => void;
}

interface UseApiRequestWithMessagesResult<TPayload, TResponse> {
  request: (
    options: UseApiRequestWithMessagesOptions<TPayload, TResponse>,
  ) => Promise<void>;
  isLoading: boolean;
  backendMessage: string | null;
  backendMessageType: MessageType;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useApiRequestWithMessages<
  TPayload = unknown,
  TResponse = unknown,
>(): UseApiRequestWithMessagesResult<TPayload, TResponse> {
  const [isLoading, setIsLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [backendMessageType, setBackendMessageType] =
    useState<MessageType>('success');
  const [showNotification, setShowNotification] = useState(false);

  async function request({
    endpoint,
    method,
    payload,
    onSuccess,
    onError,
  }: UseApiRequestWithMessagesOptions<TPayload, TResponse>): Promise<void> {
    setIsLoading(true);
    setBackendMessage(null);

    try {
      const response = await apiRequest<TResponse>({
        endpoint,
        method,
        payload,
      });

      if (hasMessage(response)) {
        setBackendMessageType('success');
        setBackendMessage(response.message);
        setShowNotification(true);
      }

      onSuccess(response);
    } catch (error: unknown) {
      const finalError =
        error instanceof Error ? error : new Error('Unknown error');

      setBackendMessageType('error');
      setBackendMessage(finalError.message);
      setShowNotification(true);

      if (onError) {
        onError(finalError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    request,
    isLoading,
    backendMessage,
    backendMessageType,
    showNotification,
    setShowNotification,
  };
}
