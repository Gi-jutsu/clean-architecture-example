import type { User } from "./aggregate-root";

export interface UserRepository {
  existsByCredentials(credentials: User["credentials"]): Promise<boolean>;
  save(user: User): Promise<void>;
}
