'use client';

import { Check, CircleAlert, Ban, Info } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  mode?: 'inline' | 'toast';
  duration?: number;
  onClose?: () => void;
}

export function Notification({
  message,
  type,
  mode = 'inline',
  duration = 6000,
  onClose,
}: NotificationProps): JSX.Element {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (mode === 'toast' && onClose) {
      const interval = setInterval(() => {
        setProgress(prev => prev - 2.5);
      }, duration / 40);

      const timeout = setTimeout(() => {
        onClose();
      }, duration);

      return (): void => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [duration, onClose, mode]);

  const commonClasses = `${
    type === 'success'
      ? 'bg-[var(--success-bg-color)] text-[var(--success-text-color)]'
      : type === 'error'
      ? 'bg-[var(--error-bg-color)] text-[var(--error-text-color)]'
      : type === 'warning'
      ? 'bg-[var(--warning-bg-color)] text-[var(--warning-text-color)]'
      : 'bg-[var(--info-bg-color)] text-[var(--info-text-color)]'
  } rounded-md text-sm`;

  function renderIcon(): JSX.Element {
    if (type === 'success') return <Check size={20} />;
    if (type === 'warning') return <CircleAlert size={20} />;
    if (type === 'error') return <Ban size={20} />;
    if (type === 'info') return <Info size={20} />;
    return <></>;
  }

  if (mode === 'toast') {
    return (
      <div
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 w-80 p-4 shadow-lg space-y-2 ${commonClasses}`}
      >
        <div className="flex items-center gap-2">
          {renderIcon()}
          <span>{message}</span>
        </div>
        <div className="w-full bg-gray-300 h-1 rounded">
          <div
            className="h-1 rounded bg-current transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-3 mb-4 break-words ${commonClasses}`}>
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
}
