import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./application.module.js";

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  await application.listen(8080);
}

void bootstrap();
