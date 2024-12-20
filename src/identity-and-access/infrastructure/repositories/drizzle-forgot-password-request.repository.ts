import { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";
import type { ForgotPasswordRequestRepository } from "@identity-and-access/domain/forgot-password-request/repository.js";
import {
  ForgotPasswordRequestSchema,
  type IdentityAndAccessDatabase,
} from "@identity-and-access/infrastructure/database/drizzle.schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/drizzle/constants.js";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";

@Injectable()
export class DrizzleForgotPasswordRequestRepository
  implements ForgotPasswordRequestRepository
{
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabase
  ) {}

  async findByAccountId(accountId: string) {
    const [record] = await this.database
      .select()
      .from(ForgotPasswordRequestSchema)
      .where(eq(ForgotPasswordRequestSchema.accountId, accountId))
      .limit(1)
      .execute();

    if (!record) {
      return null;
    }

    return ForgotPasswordRequest.fromSnapshot({
      accountId: record.accountId,
      expiresAt: DateTime.fromJSDate(record.expiresAt),
      id: record.id,
      token: record.token,
    });
  }

  async save(request: ForgotPasswordRequest) {
    // @todo(dev-ux): consider getting rid of DateTime when possible to ease the integration with the ORM
    const snapshotWithJsDate = {
      ...request.snapshot(),
      expiresAt: request.properties.expiresAt.toJSDate(),
    };

    await this.database
      .insert(ForgotPasswordRequestSchema)
      .values(snapshotWithJsDate)
      .onConflictDoUpdate({
        target: [ForgotPasswordRequestSchema.id],
        set: snapshotWithJsDate,
      });
  }
}
