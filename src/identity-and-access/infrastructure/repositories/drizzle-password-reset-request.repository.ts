import type { PasswordResetRequest } from "@identity-and-access/domain/password-reset-request/aggregate-root.js";
import type { PasswordResetRequestRepository } from "@identity-and-access/domain/password-reset-request/repository.js";
import {
  passwordResetRequestSchema,
  type IdentityAndAccessDatabase,
} from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/database/drizzle/constants.js";

@Injectable()
export class DrizzlePasswordResetRequestRepository
  implements PasswordResetRequestRepository
{
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabase
  ) {}

  async save(request: PasswordResetRequest): Promise<void> {
    const values = {
      ...request.properties,
      expiresAt: request.properties.expiresAt.toJSDate(),
    };

    await this.database
      .insert(passwordResetRequestSchema)
      .values(values)
      .onConflictDoUpdate({
        target: [passwordResetRequestSchema.id],
        set: values,
      });
  }
}
