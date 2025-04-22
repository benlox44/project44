export const LOGIN_BLOCK = {
  MAX_FAILURES: 5,
  BLOCK_TIME_SECONDS: 300, // 5 min
} as const;

export type LoginBlock = (typeof LOGIN_BLOCK)[keyof typeof LOGIN_BLOCK];
