import {
  type JwtService,
  JwtServiceToken,
} from "@identity-and-access/infrastructure/services/jwt.service.js";
import { ReadMeHttpController } from "@identity-and-access/use-cases/read-me/http.controller.js";
import { ReadMeUseCase } from "@identity-and-access/use-cases/read-me/use-case.js";
import { SignInWithGoogleHttpController } from "@identity-and-access/use-cases/sign-in-with-google/http.controller.js";
import { SignInWithGoogleUseCase } from "@identity-and-access/use-cases/sign-in-with-google/use-case.js";
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    /** HTTP Controllers */
    ReadMeHttpController,
    SignInWithGoogleHttpController,
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
      provide: SignInWithGoogleUseCase,
      useFactory: (jwt: JwtService) => new SignInWithGoogleUseCase(jwt),
      inject: [JwtServiceToken],
    },
  ],
})
export class IdentityAndAccessModule {}
