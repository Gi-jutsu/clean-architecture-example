import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { Response } from "express";
import { WrongPasswordError } from "./errors/wrong-password.error.js";
import { SignInWithCredentialsHttpRequestBody } from "./http.request.js";
import { SignInWithCredentialsUseCase } from "./use-case.js";

@Controller()
export class SignInWithCredentialsHttpController {
  constructor(private readonly useCase: SignInWithCredentialsUseCase) {}

  @Post("/authentication/sign-in")
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() body: SignInWithCredentialsHttpRequestBody,
    @Res() response: Response
  ) {
    try {
      const { accessToken } = await this.useCase.execute({
        email: body.email,
        password: body.password,
      });

      response.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      response.end();
    } catch (error: unknown) {
      // @TODO: Implement a global error mapper
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error, { cause: error });
      }

      if (error instanceof WrongPasswordError) {
        throw new UnauthorizedException(error, { cause: error });
      }

      throw error;
    }
  }
}
