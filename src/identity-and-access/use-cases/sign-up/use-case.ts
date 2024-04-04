import { User } from "@identity-and-access/domain/user/aggregate-root.js";
import type { UserRepository } from "@identity-and-access/domain/user/repository.js";
import { SignUpCommand } from "@identity-and-access/use-cases/sign-up/command.js";

export class SignUpUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: SignUpCommand): Promise<void> {
    const user = User.create(command);

    this.repository.save(user);
  }
}
