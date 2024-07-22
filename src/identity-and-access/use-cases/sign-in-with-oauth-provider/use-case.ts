import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SignInWithOAuthProviderUseCase {
  constructor(private readonly config: ConfigService) {}

  async execute(command: SignInWithOAuthProviderCommand) {
    if (command.provider !== "google") {
      throw new NotImplementedException();
    }

    return this.handleSignInWithGoogle();
  }

  async handleSignInWithGoogle() {
    const baseAuthorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
    const authorizationUrlParameters = new URLSearchParams({
      client_id: await this.config.getOrThrow("OAUTH_GOOGLE_CLIENT_ID"),
      redirect_uri:
        "http://localhost:8080/identity-and-access/oauth/google/callback",
      response_type: "code",
      scope: "email",
    });

    return {
      url: `${baseAuthorizationUrl}?${authorizationUrlParameters}`,
    };
  }
}

type SignInWithOAuthProviderCommand = {
  provider: string;
};
