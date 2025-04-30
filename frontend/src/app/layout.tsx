import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { JSX } from 'react';

import { AuthProvider } from '@/context/AuthContext';
import '@/app/styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Users Auth Flow',
  description:
    'An open-source interactive web app that demonstrates user authentication flows with a connected backend. Designed to visualize and test login, registration, and token management in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
