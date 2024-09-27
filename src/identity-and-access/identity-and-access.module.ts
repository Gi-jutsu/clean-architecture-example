import { JwtServiceToken } from "@identity-and-access/infrastructure/services/jwt.service.js";
import { Module } from "@nestjs/common";
import { AccountRepositoryToken } from "./domain/account/repository.js";
import { InMemoryAccountRepository } from "./infrastructure/repositories/in-memory-account.repository.js";
import { SignInWithCredentialsHttpController } from "./use-cases/sign-in-with-credentials/http.controller.js";
import { SignInWithCredentialsUseCase } from "./use-cases/sign-in-with-credentials/use-case.js";

@Module({
  controllers: [
    /** Http controllers */
    SignInWithCredentialsHttpController,
  ],
  providers: [
    /** Repositories */
    {
      provide: AccountRepositoryToken,
      useClass: InMemoryAccountRepository,
    },

    /** Services */
    {
      provide: JwtServiceToken,
      useValue: (await import("jsonwebtoken")).default,
    },

    /** Use cases */
    {
      provide: SignInWithCredentialsUseCase,
      useFactory: (
        ...args: ConstructorParameters<typeof SignInWithCredentialsUseCase>
      ) => new SignInWithCredentialsUseCase(...args),
      inject: [AccountRepositoryToken, JwtServiceToken],
    },
  ],
})
export class IdentityAndAccessModule {}
