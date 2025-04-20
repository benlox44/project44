import { User } from 'src/users/entities/user.entity';
import { SafeUser } from 'src/users/types/safe-user.type';

export function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
