'use client';

import Link from 'next/link';
import type { JSX, ReactNode } from 'react';

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TextLink({
  href,
  children,
  className = '',
}: TextLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      className={`text-sm text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline block text-center ${className}`}
    >
      {children}
    </Link>
  );
}
