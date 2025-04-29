'use client';

import { useEffect } from 'react';

import { useApiRequest } from '@/hooks/useApiRequest';
import type { User } from '@/types/user';

interface UseUserProfileResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileResult {
  const { data, loading, error, request } = useApiRequest<User>();

  useEffect(() => {
    void request({
      endpoint: '/users/me',
      method: 'GET',
    });
  }, [request]);

  return {
    user: data ?? null,
    loading,
    error,
  };
}
