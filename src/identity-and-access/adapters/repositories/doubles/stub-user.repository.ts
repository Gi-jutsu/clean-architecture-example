import type { User } from "../../../business-logic/domain/user/aggregate-root";
import type { UserRepository } from "../../../business-logic/domain/user/repository";

export class StubUserRepository implements UserRepository {
  public readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
