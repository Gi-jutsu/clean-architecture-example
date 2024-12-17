import { PUBLIC_METADATA } from "@shared-kernel/infrastructure/decorators/public.decorator.js";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private hasPublicDecorator(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride(PUBLIC_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  canActivate(context: ExecutionContext) {
    if (this.hasPublicDecorator(context)) {
      return true;
    }

    return false;
  }
}
