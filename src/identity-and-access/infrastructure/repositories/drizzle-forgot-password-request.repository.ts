import type { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";
import type { ForgotPasswordRequestRepository } from "@identity-and-access/domain/forgot-password-request/repository.js";
import {
  ForgotPasswordRequestSchema,
  type IdentityAndAccessDatabase,
} from "@identity-and-access/infrastructure/drizzle/schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/drizzle/constants.js";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzleForgotPasswordRequestRepository
  implements ForgotPasswordRequestRepository
{
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabase
  ) {}

  async hasPendingRequest(accountId: string): Promise<boolean> {
    const results = await this.database
      .select({ count: count() })
      .from(ForgotPasswordRequestSchema)
      .where(eq(ForgotPasswordRequestSchema.accountId, accountId))
      .execute();

    return results[0].count > 0;
  }

  async save(request: ForgotPasswordRequest): Promise<void> {
    const values = {
      ...request.properties,
      expiresAt: request.properties.expiresAt.toJSDate(),
    };

    await this.database
      .insert(ForgotPasswordRequestSchema)
      .values(values)
      .onConflictDoUpdate({
        target: [ForgotPasswordRequestSchema.id],
        set: values,
      });
  }
}
