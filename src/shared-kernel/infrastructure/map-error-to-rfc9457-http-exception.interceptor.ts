import { ResourceAlreadyExistsError } from "@core/errors/resource-already-exists.error.js";
import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class MapErrorToRfc9457HttpException implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((error) => this.throwAsHttpException(error)));
  }

  private throwAsHttpException(error: unknown): Observable<never> {
    if (error instanceof ResourceNotFoundError) {
      return throwError(() => new NotFoundException(error, { cause: error }));
    }

    if (error instanceof ResourceAlreadyExistsError) {
      return throwError(() => new ConflictException(error, { cause: error }));
    }

    return throwError(
      () =>
        new HttpException(
          {
            code: (error as any).code ?? "internal-server-error",
            detail: (error as any).detail ?? "An unexpected error occurred.",
            status: (error as any).status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: (error as any).timestamp ?? new Date().toISOString(),
            title: (error as any).title ?? "Internal Server Error",
          },
          (error as any).status ?? HttpStatus.INTERNAL_SERVER_ERROR
        )
    );
  }
}