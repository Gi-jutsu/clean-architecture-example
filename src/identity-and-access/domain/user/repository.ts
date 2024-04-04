import type { User } from "@identity-and-access/domain/user/aggregate-root.js";

export interface UserRepository {
  existsByCredentials(credentials: User["credentials"]): Promise<boolean>;
  save(user: User): Promise<void>;
}
