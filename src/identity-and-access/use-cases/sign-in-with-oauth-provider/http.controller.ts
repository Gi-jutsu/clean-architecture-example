import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Redirect,
} from "@nestjs/common";
import { SignInWithOAuthProviderUseCase } from "./use-case.js";

@Controller()
export class SignInWithOAuthProviderHttpController {
  constructor(private readonly useCase: SignInWithOAuthProviderUseCase) {}

  @Get("/identity-and-access/oauth/:provider")
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  async signInWithGoogle(@Param("provider") provider: string) {
    return await this.useCase.execute({ provider });
  }
}
