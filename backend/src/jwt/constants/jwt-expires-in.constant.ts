export const JWT_EXPIRES_IN = {
  RESET_PASSWORD: '1h',
  CONFIRM_EMAIL: '1d',
  CONFIRM_EMAIL_UPDATE: '1d',
  REVERT_EMAIL: '30d',
  SESSION: '7d',
} as const;

export type JwtExpiresIn = (typeof JWT_EXPIRES_IN)[keyof typeof JWT_EXPIRES_IN];
