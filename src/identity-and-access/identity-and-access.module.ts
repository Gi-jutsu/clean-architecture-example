import { JwtServiceToken } from "@identity-and-access/infrastructure/services/jwt.service.js";
import { Module } from "@nestjs/common";
import { AccountRepositoryToken } from "./domain/account/repository.js";
import { PasswordResetRequestRepositoryToken } from "./domain/password-reset-request/repository.js";
import { DrizzleAccountRepository } from "./infrastructure/repositories/drizzle-account.repository.js";
import { InMemoryPasswordResetRequestRepository } from "./infrastructure/repositories/in-memory-password-reset-request.repository.js";
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
      useClass: InMemoryPasswordResetRequestRepository,
    },

    /** Services */
    {
      provide: JwtServiceToken,
      useValue: (await import("jsonwebtoken")).default,
    },

    /** Use cases */
    {
      provide: ForgotPasswordUseCase,
      useFactory: (
        ...args: ConstructorParameters<typeof ForgotPasswordUseCase>
      ) => new ForgotPasswordUseCase(...args),
      inject: [AccountRepositoryToken, PasswordResetRequestRepositoryToken],
    },
    {
      provide: SignInWithCredentialsUseCase,
      useFactory: (
        ...args: ConstructorParameters<typeof SignInWithCredentialsUseCase>
      ) => new SignInWithCredentialsUseCase(...args),
      inject: [AccountRepositoryToken, JwtServiceToken],
    },
    {
      provide: SignUpWithCredentialsUseCase,
      useFactory: (
        ...args: ConstructorParameters<typeof SignUpWithCredentialsUseCase>
      ) => new SignUpWithCredentialsUseCase(...args),
      inject: [AccountRepositoryToken],
    },
  ],
})
export class IdentityAndAccessModule {}
