import type { User } from "../../../domain/user/aggregate-root";
import type { UserRepository } from "../../../domain/user/repository";

export class StubUserRepository implements UserRepository {
  public readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
