import type { User } from "@identity-and-access/domain/user/aggregate-root.js";
import type { UserRepository } from "@identity-and-access/domain/user/repository.js";

export class InMemoryUserRepository implements UserRepository {
  public records: User[] = [];

  public async existsByCredentials(
    credentials: User["credentials"]
  ): Promise<boolean> {
    return this.records.some(
      (user) =>
        user.credentials.email === credentials.email &&
        user.credentials.password === credentials.password
    );
  }

  async save(user: User): Promise<void> {
    this.records.push(user);
  }
}
