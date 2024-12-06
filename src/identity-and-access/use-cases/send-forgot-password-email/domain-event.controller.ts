import { PasswordResetRequestedDomainEvent } from "@identity-and-access/domain/password-reset-request/events/password-reset-requested.domain-event.js";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SendForgotPasswordEmailUseCase } from "./use-case.js";

@Injectable()
export class SendForgotPasswordEmailDomainEventController {
  constructor(private readonly useCase: SendForgotPasswordEmailUseCase) {}

  @OnEvent(PasswordResetRequestedDomainEvent.name)
  async handle(payload: PasswordResetRequestedDomainEvent["payload"]) {
    await this.useCase.execute({
      account: {
        email: payload.accountId,
      },
      passwordResetRequest: {
        token: payload.token,
      },
    });
  }
}
