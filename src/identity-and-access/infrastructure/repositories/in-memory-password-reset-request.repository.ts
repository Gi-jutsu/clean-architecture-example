import type { PasswordResetRequest } from "@identity-and-access/domain/password-reset-request/aggregate-root.js";
import type { PasswordResetRequestRepository } from "@identity-and-access/domain/password-reset-request/repository.js";

export class InMemoryPasswordResetRequestRepository
  implements PasswordResetRequestRepository
{
  snapshots = new Map();

  async save(request: PasswordResetRequest): Promise<void> {
    this.snapshots.set(request.id, request.properties);
  }
}
