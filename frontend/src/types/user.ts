export interface User {
  id: number;
  createdAt: string; // ISO date
  isLocked: boolean;
  name: string;
  email: string;
  isEmailConfirmed: boolean;
  oldEmail: string | null;
  newEmail: string | null;
  emailChangedAt: string | null;
}
