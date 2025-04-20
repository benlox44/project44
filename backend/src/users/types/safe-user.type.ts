import { User } from '../entities/user.entity';

export type SafeUser = Omit<User, 'password'>;
