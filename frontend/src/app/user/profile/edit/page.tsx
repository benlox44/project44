'use client';

import { JSX } from 'react';

import { EditEmailForm } from './EditEmailForm';
import { EditPasswordForm } from './EditPasswordForm';
import { EditProfileForm } from './EditProfileForm';

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
