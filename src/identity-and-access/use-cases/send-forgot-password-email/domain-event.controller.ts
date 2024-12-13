import { ForgotPasswordRequestCreatedDomainEvent } from "@identity-and-access/domain/forgot-password-request/events/forgot-password-request-created.domain-event.js";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SendForgotPasswordEmailUseCase } from "./use-case.js";

@Injectable()
export class SendForgotPasswordEmailDomainEventController {
  constructor(private readonly useCase: SendForgotPasswordEmailUseCase) {}

  @OnEvent(ForgotPasswordRequestCreatedDomainEvent.name)
  async handle(payload: ForgotPasswordRequestCreatedDomainEvent["payload"]) {
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
