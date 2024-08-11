import { JwtService } from "@identity-and-access/infrastructure/services/jwt.service.js";

/** @TODO: SignInWithOAuthProviderUseCase should be responsible for
 * - exchanging the code for tokens
 * - generating the access and refresh token (RFC 9068)
 */
export class SignInWithOAuthProviderUseCase {
  constructor(private readonly jwt: JwtService) {}

  async execute(command: SignInWithOAuthProviderCommand) {
    return {
      accessToken: this.jwt.sign(
        {
          iss: "http://localhost:8080",
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
          aud: "http://localhost:8080",
          sub: "fake_user_id",
          iat: Math.floor(Date.now() / 1000), // now
        },
        "secret"
      ),
    };
  }
}

export type SignInWithOAuthProviderCommand = {
  code: string;
  // @TODO: Add more OAuth providers (e.g. Google, Facebook, GitHub)
  provider: "google";
};
