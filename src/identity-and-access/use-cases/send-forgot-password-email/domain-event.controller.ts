import { ForgotPasswordRequestedDomainEvent } from "@identity-and-access/domain/forgot-password-request/events/password-reset-requested.domain-event.js";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SendForgotPasswordEmailUseCase } from "./use-case.js";

@Injectable()
export class SendForgotPasswordEmailDomainEventController {
  constructor(private readonly useCase: SendForgotPasswordEmailUseCase) {}

  @OnEvent(ForgotPasswordRequestedDomainEvent.name)
  async handle(payload: ForgotPasswordRequestedDomainEvent["payload"]) {
    await this.useCase.execute({
      account: {
        email: payload.accountId,
      },
      forgotPasswordRequest: {
        token: payload.token,
      },
    });
  }
}
