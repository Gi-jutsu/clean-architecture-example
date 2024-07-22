import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ApplicationModule } from "./application.module.js";

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  application.enableShutdownHooks();
  application.use(cookieParser());

  const host = process.env.API_HTTP_HOST || "127.0.0.1";
  const port = process.env.API_HTTP_PORT || "8080";
  const scheme = process.env.API_HTTP_SCHEME || "http";
  const url = `${scheme}://${host}:${port}`;

  await application.listen(port, host, () =>
    console.log(`🚀 API is running on ${url}`)
  );
}

void bootstrap();
