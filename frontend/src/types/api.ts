import type { MessageType } from './common';

export interface ApiRequestOptions<TPayload, TResponse> {
  endpoint: string;
  payload: TPayload;
  onSuccess: (data: TResponse) => void;
  onError?: (error: Error) => void;
  setBackendMessage?: (message: string) => void;
  setBackendMessageType?: (type: MessageType) => void;
  setIsLoading?: (loading: boolean) => void;
  setShowNotification?: (show: boolean) => void;
}
