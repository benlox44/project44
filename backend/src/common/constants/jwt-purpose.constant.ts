export const JWT_PURPOSE = {
  SESSION: 'session',
  UNLOCK_ACCOUNT: 'unlock-account',
  CONFIRM_EMAIL: 'confirm-email',
  CONFIRM_EMAIL_UPDATE: 'confirm-email-update',
  REVERT_EMAIL: 'revert-email',
  RESET_PASSWORD: 'reset-password',
  RESET_PASSWORD_AFTER_REVERT: 'reset-password-after-revert',
} as const;

export type JwtPurpose = (typeof JWT_PURPOSE)[keyof typeof JWT_PURPOSE];
