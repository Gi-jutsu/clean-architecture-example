import type { PasswordResetRequest } from "@identity-and-access/domain/password-reset-request/aggregate-root.js";
import type { PasswordResetRequestRepository } from "@identity-and-access/domain/password-reset-request/repository.js";
import {
  passwordResetRequestSchema,
  type IdentityAndAccessDatabase,
} from "@identity-and-access/infrastructure/drizzle/schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/drizzle/constants.js";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzlePasswordResetRequestRepository
  implements PasswordResetRequestRepository
{
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabase
  ) {}

  async hasPendingRequest(accountId: string): Promise<boolean> {
    const results = await this.database
      .select({ count: count() })
      .from(passwordResetRequestSchema)
      .where(eq(passwordResetRequestSchema.accountId, accountId))
      .execute();

    return results[0].count > 0;
  }

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
