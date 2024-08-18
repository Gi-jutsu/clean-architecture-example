import { JwtService } from "@identity-and-access/infrastructure/services/jwt.service.js";

/** @TODO: SignInWithGoogleUseCase should be responsible for
 * - exchanging the code for tokens
 * - generating the access and refresh token (RFC 9068)
 */
export class SignInWithGoogleUseCase {
  constructor(private readonly jwt: JwtService) {}

  async execute(command: SignInWithGoogleCommand) {
    return {
      accessToken: this.jwt.sign(
        {
          iss: "http://localhost:8080",
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
          aud: "http://localhost:8080",
          sub: "fake_user_id",
          iat: Math.floor(Date.now() / 1000), // now
        },
        // @TODO: Use an environment variable for the secret
        "secret"
      ),
    };
  }
}

export type SignInWithGoogleCommand = {
  // The code received from the Google OAuth callback
  // @see https://developers.google.com/identity/protocols/oauth2/web-server
  code: string;
};
