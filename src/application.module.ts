import { SignInWithOAuthProviderHttpController } from "@identity-and-access/use-cases/sign-in-with-oauth-provider/http.controller.js";
import { HttpModule } from "@nestjs/axios";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthCheckHttpController } from "./shared-kernel/use-cases/health-check/http.controller.js";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [
    HealthCheckHttpController,
    SignInWithOAuthProviderHttpController,
  ],
})
export class ApplicationModule implements OnApplicationShutdown {
  private readonly logger = new Logger(ApplicationModule.name);

  onApplicationShutdown() {
    this.logger.warn("Application is shutting down...");
    process.exit(0);
  }
}
