import {
  type JwtService,
  JwtServiceToken,
} from "@identity-and-access/infrastructure/services/jwt.service.js";
import { ReadMeHttpController } from "@identity-and-access/use-cases/read-me/http.controller.js";
import { ReadMeUseCase } from "@identity-and-access/use-cases/read-me/use-case.js";
import { SignInWithOAuthProviderHttpController } from "@identity-and-access/use-cases/sign-in-with-oauth-provider/http.controller.js";
import { SignInWithOAuthProviderUseCase } from "@identity-and-access/use-cases/sign-in-with-oauth-provider/use-case.js";
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    /** HTTP Controllers */
    ReadMeHttpController,
    SignInWithOAuthProviderHttpController,
  ],
  providers: [
    /** Infrastructure / Services */
    {
      provide: JwtServiceToken,
      useValue: (await import("jsonwebtoken")).default,
    },

    /** Use Cases */
    ReadMeUseCase,
    {
      provide: SignInWithOAuthProviderUseCase,
      useFactory: (jwt: JwtService) => new SignInWithOAuthProviderUseCase(jwt),
      inject: [JwtServiceToken],
    },
  ],
})
export class IdentityAndAccessModule {}
