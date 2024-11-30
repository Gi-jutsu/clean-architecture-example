import { createFactoryFromConstructor } from "@core/create-factory-from-constructor.js";
import { Module } from "@nestjs/common";
import { OutboxMessageRepositoryToken } from "@shared-kernel/domain/outbox-message/repository.js";
import { AccountRepositoryToken } from "./domain/account/repository.js";
import { JwtToken } from "./domain/jwt.port.js";
import { PasswordHasherToken } from "./domain/password-hasher.port.js";
import { PasswordResetRequestRepositoryToken } from "./domain/password-reset-request/repository.js";
import { DrizzleAccountRepository } from "./infrastructure/repositories/drizzle-account.repository.js";
import { DrizzlePasswordResetRequestRepository } from "./infrastructure/repositories/drizzle-password-reset-request.repository.js";
import { ForgotPasswordHttpController } from "./use-cases/forgot-password/http.controller.js";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password/use-case.js";
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

    /** Ports */
    {
      provide: JwtToken,
      useValue: (await import("jsonwebtoken")).default,
    },
    {
      provide: PasswordHasherToken,
      useValue: (await import("bcrypt")).default,
    },

    /** Use cases */
    {
      provide: ForgotPasswordUseCase,
      useFactory: createFactoryFromConstructor(ForgotPasswordUseCase),
      inject: [
        AccountRepositoryToken,
        PasswordResetRequestRepositoryToken,
        OutboxMessageRepositoryToken,
      ],
    },
    {
      provide: SignInWithCredentialsUseCase,
      useFactory: createFactoryFromConstructor(SignInWithCredentialsUseCase),
      inject: [AccountRepositoryToken, JwtToken, PasswordHasherToken],
    },
    {
      provide: SignUpWithCredentialsUseCase,
      useFactory: createFactoryFromConstructor(SignUpWithCredentialsUseCase),
      inject: [AccountRepositoryToken, PasswordHasherToken],
    },
  ],
})
export class IdentityAndAccessModule {}
