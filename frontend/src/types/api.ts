export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TPayload = unknown> {
  endpoint: string;
  method: HttpMethod;
  payload?: TPayload;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiTokenResponse {
  access_token: string;
}

export interface ApiResetTokenResponse {
  reset_token: string;
}
