import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotImplementedException,
  Param,
  Query,
  Redirect,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { SignInWithGoogleUseCase } from "./use-case.js";

@Controller()
export class SignInWithGoogleHttpController {
  constructor(
    private readonly config: ConfigService,
    private readonly useCase: SignInWithGoogleUseCase
  ) {}

  @Get("/identity-and-access/oauth/:provider")
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  async redirectToAuthorizationUrl(@Param("provider") provider: string) {
    // @TODO: Handle more OAuth providers (e.g. Google, Facebook, GitHub)
    if (provider !== "google") {
      throw new NotImplementedException();
    }

    const baseAuthorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth";
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

  @Get("/identity-and-access/oauth/:provider/callback")
  async exchangeCodeForTokens(
    @Param("provider") provider: string,
    @Query("code") code: string,
    @Res() response: Response
  ) {
    // @TODO: Handle more OAuth providers (e.g. Google, Facebook, GitHub)
    if (provider !== "google") {
      throw new NotImplementedException();
    }

    try {
      const { accessToken } = await this.useCase.execute({ code });

      response.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      response.end();
    } catch (error: unknown) {
      throw new InternalServerErrorException();
    }
  }
}
