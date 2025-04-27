'use client';

import { useState, Dispatch, SetStateAction } from 'react';

import type { MessageType } from '@/types/common';

interface UseBackendFeedbackReturn {
  backendMessage: string | null;
  setBackendMessage: Dispatch<SetStateAction<string | null>>;
  backendMessageType: MessageType;
  setBackendMessageType: Dispatch<SetStateAction<MessageType>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  showNotification: boolean;
  setShowNotification: Dispatch<SetStateAction<boolean>>;
}

export function useBackendFeedback(
  defaultType: MessageType = 'warning',
): UseBackendFeedbackReturn {
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [backendMessageType, setBackendMessageType] =
    useState<MessageType>(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  return {
    backendMessage,
    setBackendMessage,
    backendMessageType,
    setBackendMessageType,
    isLoading,
    setIsLoading,
    showNotification,
    setShowNotification,
  };
}
