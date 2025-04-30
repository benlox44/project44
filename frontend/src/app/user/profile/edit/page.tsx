'use client';

import { JSX } from 'react';

import { EditEmailForm } from '@/app/user/profile/edit/EditEmailForm';
import { EditPasswordForm } from '@/app/user/profile/edit/EditPasswordForm';
import { EditProfileForm } from '@/app/user/profile/edit/EditProfileForm';
import { BackButton } from '@/components/buttons/BackButton';
import { PageLayout } from '@/components/PageLayout';

export default function EditProfilePage(): JSX.Element {
  return (
    <PageLayout title="Edit Profile">
      <EditProfileForm />
      <EditPasswordForm />
      <EditEmailForm />
      <BackButton href="/" />
    </PageLayout>
  );
}
