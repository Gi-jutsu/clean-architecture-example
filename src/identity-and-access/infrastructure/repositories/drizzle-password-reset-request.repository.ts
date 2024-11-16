import type { PasswordResetRequest } from "@identity-and-access/domain/password-reset-request/aggregate-root.js";
import type { PasswordResetRequestRepository } from "@identity-and-access/domain/password-reset-request/repository.js";
import {
  IdentityAndAccessDatabaseTransactionAdapter,
  passwordResetRequestSchema,
} from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DrizzlePasswordResetRequestRepository
  implements PasswordResetRequestRepository
{
  constructor(
    private readonly txHost: TransactionHost<IdentityAndAccessDatabaseTransactionAdapter>
  ) {}

  async save(request: PasswordResetRequest): Promise<void> {
    const values = {
      ...request.properties,
      expiresAt: request.properties.expiresAt.toJSDate(),
    };

    await this.txHost.tx
      .insert(passwordResetRequestSchema)
      .values(values)
      .onConflictDoUpdate({
        target: [passwordResetRequestSchema.id],
        set: values,
      });
  }
}
