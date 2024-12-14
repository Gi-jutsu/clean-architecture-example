import { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";
import type { ForgotPasswordRequestRepository } from "@identity-and-access/domain/forgot-password-request/repository.js";

export class InMemoryForgotPasswordRequestRepository
  implements ForgotPasswordRequestRepository
{
  snapshots = new Map();

  async findByAccountId(accountId: string) {
    for (const [id, properties] of this.snapshots.entries()) {
      if (properties.accountId !== accountId) continue;

      return ForgotPasswordRequest.hydrate({
        properties,
        id,
      });
    }

    return null;
  }

  async save(request: ForgotPasswordRequest) {
    this.snapshots.set(request.id, request.properties);
  }
}
