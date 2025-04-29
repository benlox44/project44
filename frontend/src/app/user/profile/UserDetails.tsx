'use client';

import { JSX } from 'react';

import { useUserProfile } from '@/hooks/useUserProfile';

export function UserDetails(): JSX.Element {
  const { user, loading } = useUserProfile();

  if (loading || !user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="space-y-2 mb-6">
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
      </p>
      {user.newEmail && (
        <p className="text-sm text-yellow-600">
          Pending email change to: {user.newEmail}
        </p>
      )}
      {user.isLocked && (
        <p className="text-sm text-red-600">Account is locked.</p>
      )}
      {!user.isEmailConfirmed && (
        <p className="text-sm text-orange-600">Email is not confirmed.</p>
      )}
    </div>
  );
}
