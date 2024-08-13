import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ReadMeUseCase } from "./use-case.js";

@Controller()
export class ReadMeHttpController {
  private readonly logger = new Logger(ReadMeHttpController.name);

  constructor(private readonly useCase: ReadMeUseCase) {}

  @Get("/identity-and-access/me")
  async handle() {
    try {
      return await this.useCase.execute();
    } catch (error: unknown) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
