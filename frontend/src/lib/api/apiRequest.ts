import type { ApiRequestOptions } from '@/types/api';

export async function apiRequest<TResponse>({
  endpoint,
  method,
  payload,
}: ApiRequestOptions): Promise<TResponse> {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: method !== 'GET' && payload ? JSON.stringify(payload) : undefined,
  });

  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = data as { message?: string };
    throw new Error(errorData.message || 'No message from backend');
  }

  return data as TResponse;
}
