import { ResourceAlreadyExistsError } from "@core/errors/resource-already-exists.error.js";
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { SignUpWithCredentialsHttpRequestBody } from "./http.request.js";
import { SignUpWithCredentialsUseCase } from "./use-case.js";

@Controller()
export class SignUpWithCredentialsHttpController {
  constructor(private readonly useCase: SignUpWithCredentialsUseCase) {}

  @Post("/authentication/sign-up")
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: SignUpWithCredentialsHttpRequestBody) {
    try {
      return await this.useCase.execute({
        email: body.email,
        password: body.password,
      });
    } catch (error: unknown) {
      // @TODO: Implement a global error mapper
      if (error instanceof ResourceAlreadyExistsError) {
        throw new ConflictException(error, { cause: error });
      }

      throw error;
    }
  }
}
