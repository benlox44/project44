'use client';

import Link from 'next/link';
import { JSX } from 'react';

import { DeleteAccountButton } from '@/app/user/profile/DeleteButton';
import { UserDetails } from '@/app/user/profile/UserDetails';
import { Button } from '@/components/buttons/Button';
import { PageLayout } from '@/components/PageLayout';

export default function ProfilePage(): JSX.Element {
  return (
    <PageLayout title="Your Profile">
      <UserDetails />

      <div className="flex flex-col space-y-4">
        <Link href="/user/profile/edit">
          <Button>Edit Profile</Button>
        </Link>

        <DeleteAccountButton />
      </div>
    </PageLayout>
  );
}
