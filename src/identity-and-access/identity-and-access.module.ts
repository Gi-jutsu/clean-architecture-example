import { createFactoryForUseCase } from "@core/use-case.factory.js";
import { Module } from "@nestjs/common";
import { OutboxMessageRepositoryToken } from "@shared-kernel/domain/outbox-message/repository.js";
import { AccountRepositoryToken } from "./domain/account/repository.js";
import { createJwtService, JwtServiceToken } from "./domain/jwt.service.js";
import { PasswordResetRequestRepositoryToken } from "./domain/password-reset-request/repository.js";
import { DrizzleAccountRepository } from "./infrastructure/repositories/drizzle-account.repository.js";
import { DrizzlePasswordResetRequestRepository } from "./infrastructure/repositories/drizzle-password-reset-request.repository.js";
import { ForgotPasswordHttpController } from "./use-cases/forgot-password/http.controller.js";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password/use-case.js";
import { SendEmailOnForgottenPasswordDomainEventListener } from "./use-cases/send-email-on-forgotten-password/domain-event.listener.js";
import { SignInWithCredentialsHttpController } from "./use-cases/sign-in-with-credentials/http.controller.js";
import { SignInWithCredentialsUseCase } from "./use-cases/sign-in-with-credentials/use-case.js";
import { SignUpWithCredentialsHttpController } from "./use-cases/sign-up-with-credentials/http.controller.js";
import { SignUpWithCredentialsUseCase } from "./use-cases/sign-up-with-credentials/use-case.js";

@Module({
  controllers: [
    ForgotPasswordHttpController,
    SignInWithCredentialsHttpController,
    SignUpWithCredentialsHttpController,
  ],
  providers: [
    /** Repositories */
    {
      provide: AccountRepositoryToken,
      useClass: DrizzleAccountRepository,
    },
    {
      provide: PasswordResetRequestRepositoryToken,
      useClass: DrizzlePasswordResetRequestRepository,
    },

    SendEmailOnForgottenPasswordDomainEventListener,

    /** Services */
    {
      provide: JwtServiceToken,
      useValue: createJwtService(),
    },

    /** Use cases */
    {
      provide: ForgotPasswordUseCase,
      useFactory: createFactoryForUseCase(ForgotPasswordUseCase),
      inject: [
        AccountRepositoryToken,
        PasswordResetRequestRepositoryToken,
        OutboxMessageRepositoryToken,
      ],
    },
    {
      provide: SignInWithCredentialsUseCase,
      useFactory: createFactoryForUseCase(SignInWithCredentialsUseCase),
      inject: [AccountRepositoryToken, JwtServiceToken],
    },
    {
      provide: SignUpWithCredentialsUseCase,
      useFactory: createFactoryForUseCase(SignUpWithCredentialsUseCase),
      inject: [AccountRepositoryToken],
    },
  ],
})
export class IdentityAndAccessModule {}
