'use client';

import { useState, useCallback } from 'react';

import { apiRequest } from '@/lib/api/apiRequest';
import type { ApiRequestOptions, ApiResponse } from '@/types/api';

interface UseApiRequestResult<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  request: (options: ApiRequestOptions) => Promise<void>;
}

export function useApiRequest<TData = unknown>(): UseApiRequestResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (options: ApiRequestOptions): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiRequest<ApiResponse<TData>>(options);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, loading, error, request };
}
