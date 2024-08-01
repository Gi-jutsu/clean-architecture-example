import { Module } from "@nestjs/common";
import { SignInWithOAuthProviderHttpController } from "./use-cases/sign-in-with-oauth-provider/http.controller.js";

@Module({
  controllers: [
    /** HTTP Controllers */
    SignInWithOAuthProviderHttpController,
  ],
})
export class IdentityAndAccessModule {}
