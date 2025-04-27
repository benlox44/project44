'use client';

import { InputHTMLAttributes, JSX } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({
  label,
  className = '',
  ...props
}: FormInputProps): JSX.Element {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        className={`w-full px-3 py-2 border rounded-md 
          bg-[var(--input-bg-color)] 
          border-[var(--input-border-color)] 
          hover:border-[var(--input-border-hover-color)] 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[var(--input-ring-focus-color)] 
          focus:border-[var(--input-border-focus-color)] 
          transition
          ${className}`}
        {...props}
      />
    </div>
  );
}
