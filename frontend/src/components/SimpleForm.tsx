'use client';

import { JSX } from 'react';

import { BackButton } from '@/components/buttons/BackButton';
import { Button } from '@/components/buttons/Button';
import { FormInput } from '@/components/FormInput';

interface Field {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SimpleFormProps {
  fields: Field[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
  loading?: boolean;
  children?: React.ReactNode;
  backHref?: string;
}

export function SimpleForm({
  fields,
  onSubmit,
  submitButtonText,
  loading = false,
  children,
  backHref,
}: SimpleFormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field, index) => (
        <FormInput
          key={index}
          label={field.label}
          type={field.type}
          value={field.value}
          onChange={field.onChange}
          required
        />
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : submitButtonText}
      </Button>
      {children}
      {backHref && <BackButton href={backHref} />}{' '}
    </form>
  );
}
