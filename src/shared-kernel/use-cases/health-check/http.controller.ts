import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthCheckHttpController {
  @Get("/health-check")
  async handle() {}
}
