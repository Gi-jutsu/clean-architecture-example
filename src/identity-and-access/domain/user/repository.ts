import type { User } from "./aggregate-root";

export interface UserRepository {
  save(user: User): Promise<void>;
}
