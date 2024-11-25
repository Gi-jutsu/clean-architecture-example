import { PasswordResetRequestedDomainEvent } from "@identity-and-access/domain/password-reset-request/events/password-reset-requested.domain-event.js";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

/**
 * Only for demonstration purposes.
 */
@Injectable()
export class SendEmailOnForgottenPasswordDomainEventListener {
  @OnEvent(PasswordResetRequestedDomainEvent.name)
  async handle(): Promise<void> {
    console.log("Sending email on forgotten password");
  }
}
