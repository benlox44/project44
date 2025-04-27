'use client';

import { JSX } from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="w-full max-w-xs space-y-4">{children}</div>
    </main>
  );
}
