import { User } from "src/users/user.entity";
import { SafeUser } from "src/users/types/safe-user-type";

export function excludePassword(user: User): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser;
}
