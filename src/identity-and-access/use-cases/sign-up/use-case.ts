import { User } from "../../domain/user/aggregate-root";
import type { UserRepository } from "../../domain/user/repository";
import { SignUpCommand } from "./command";

export class SignUpUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: SignUpCommand): Promise<void> {
    const user = User.create(command);

    this.repository.save(user);
  }
}
