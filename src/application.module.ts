import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
})
export class ApplicationModule implements OnApplicationShutdown {
  onApplicationShutdown() {
    process.exit();
  }
}
