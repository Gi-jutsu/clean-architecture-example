import {
  Logger,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import { tap } from "rxjs";

export class HttpResponseLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpResponseLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const executionTime = Date.now() - start;

        this.logger.log(
          `${request.method} ${response.statusCode} ${request.originalUrl} - ${executionTime}ms`
        );
      })
    );
  }
}
