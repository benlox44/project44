'use client';

import { ButtonHTMLAttributes, JSX } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({
  children,
  className = '',
  ...props
}: ButtonProps): JSX.Element {
  const hasCustomBackground = className.includes('bg-');

  return (
    <button
      className={`w-full py-2 px-4 rounded-md mb-4
        ${className}
        text-[var(--button-text-color)]
        ${
          !hasCustomBackground
            ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)]'
            : ''
        }
        focus:outline-none focus:ring-2 transition`}
      {...props}
    >
      {children}
    </button>
  );
}
