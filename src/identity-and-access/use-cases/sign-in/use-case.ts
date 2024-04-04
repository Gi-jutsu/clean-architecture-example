import type { UserRepository } from "../../domain/user/repository";
import { SignInQuery } from "./query";

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
