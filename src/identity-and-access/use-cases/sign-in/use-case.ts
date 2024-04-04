import type { UserRepository } from "@identity-and-access/domain/user/repository.js";
import { SignInQuery } from "@identity-and-access/use-cases/sign-in/query.js";

export class SignInUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: SignInQuery) {
    await this.checkIfUserExistsOrThrow(query);

    return {
      accessToken: "",
      refreshToken: "",
    };
  }

  private async checkIfUserExistsOrThrow(query: SignInQuery) {
    const exists = await this.repository.existsByCredentials(query.credentials);

    if (!exists) {
      throw new Error();
    }
  }
}
