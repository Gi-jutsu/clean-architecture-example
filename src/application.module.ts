import { IdentityAndAccessModule } from "@identity-and-access/identity-and-access.module.js";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { SharedKernelModule } from "@shared-kernel/shared-kernel.module.js";

@Module({
  imports: [IdentityAndAccessModule, SharedKernelModule],
})
export class ApplicationModule implements OnApplicationShutdown {
  private readonly logger = new Logger(ApplicationModule.name);

  onApplicationShutdown() {
    this.logger.warn("Application is shutting down...");
    process.exit(0);
  }
}
