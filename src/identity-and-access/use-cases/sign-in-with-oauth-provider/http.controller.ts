import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Redirect,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class SignInWithOAuthProviderHttpController {
  constructor(private readonly config: ConfigService) {}

  @Get("/identity-and-access/oauth/google")
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  async signInWithGoogle() {
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
