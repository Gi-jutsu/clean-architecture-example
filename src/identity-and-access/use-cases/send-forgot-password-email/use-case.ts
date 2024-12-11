import type { ConfigService } from "@nestjs/config";
import type { Mailer } from "@shared-kernel/domain/mailer.interface.js";

export class SendForgotPasswordEmailUseCase {
  constructor(
    private readonly config: ConfigService,
    private readonly mailer: Mailer
  ) {}

  async execute(command: SendForgotPasswordEmailCommand) {
    await this.mailer.sendEmailWithTemplate(
      command.account.email,
      "forgot-password",
      {
        link: `http://localhost:8080/reset-password?token=${command.forgotPasswordRequest.token}`,
      }
    );
  }
}

type SendForgotPasswordEmailCommand = {
  account: {
    email: string;
  };
  forgotPasswordRequest: {
    token: string;
  };
};
