import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedKernelModule {}
