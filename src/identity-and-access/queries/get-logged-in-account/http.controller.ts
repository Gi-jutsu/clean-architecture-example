import { Controller, Get } from "@nestjs/common";

@Controller()
export class GetLoggedInAccountHttpController {
  @Get("/auth/me")
  handle() {
    // @TODO: To be implemented (when authentication guard is ready)
    return {
      account: {
        id: "52afc7a5-f0e7-4477-b5c7-249ef34099a1",
        email: "dylan@call-me-dev.com",
      },
    };
  }
}
