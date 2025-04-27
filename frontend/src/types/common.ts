export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface SuccessResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
}
