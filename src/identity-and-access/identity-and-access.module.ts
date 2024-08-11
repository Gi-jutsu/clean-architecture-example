import {
  type JwtService,
  JwtServiceToken,
} from "@identity-and-access/infrastructure/services/jwt.service.js";
import { SignInWithOAuthProviderHttpController } from "@identity-and-access/use-cases/sign-in-with-oauth-provider/http.controller.js";
import { SignInWithOAuthProviderUseCase } from "@identity-and-access/use-cases/sign-in-with-oauth-provider/use-case.js";
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    /** HTTP Controllers */
    SignInWithOAuthProviderHttpController,
  ],
  providers: [
    /** Infrastructure / Services */
    {
      provide: JwtServiceToken,
      useValue: (await import("jsonwebtoken")).default,
    },

    /** Use Cases */
    {
      provide: SignInWithOAuthProviderUseCase,
      useFactory: (jwt: JwtService) => new SignInWithOAuthProviderUseCase(jwt),
      inject: [JwtServiceToken],
    },
  ],
})
export class IdentityAndAccessModule {}
