export const JWT_PURPOSE = {
  CONFIRM_EMAIL: 'confirm-email',
  CONFIRM_EMAIL_UPDATE: 'confirm-email-update',
  REVERT_EMAIL: 'revert-email',
  RESET_PASSWORD_AFTER_REVERT: 'reset-password-after-revert',
  SESSION: 'session',
} as const;

export type JwtPurpose = (typeof JWT_PURPOSE)[keyof typeof JWT_PURPOSE];
