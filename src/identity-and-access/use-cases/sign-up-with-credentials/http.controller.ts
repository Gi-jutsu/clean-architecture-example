import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SignUpWithCredentialsHttpRequestBody } from "./http.request.js";
import { SignUpWithCredentialsUseCase } from "./use-case.js";

@Controller()
export class SignUpWithCredentialsHttpController {
  constructor(private readonly useCase: SignUpWithCredentialsUseCase) {}

  @Post("/authentication/sign-up")
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: SignUpWithCredentialsHttpRequestBody) {
    return await this.useCase.execute({
      email: body.email,
      password: body.password,
    });
  }
}
