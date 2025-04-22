import { Redis } from 'ioredis';

import { required } from 'src/common/config/env.config';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (): Promise<Redis> => {
    const Redis = await import('ioredis');
    return new Redis.default({
      host: required('REDIS_HOST'),
      port: Number(required('REDIS_PORT')),
    });
  },
};
