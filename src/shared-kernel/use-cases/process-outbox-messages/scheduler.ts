import { OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { ProcessOutboxMessagesUseCase } from "./use-case.js";

export class ProcessOutboxMessagesScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private _intervalId: NodeJS.Timeout;

  constructor(private readonly useCase: ProcessOutboxMessagesUseCase) {}

  async handle() {
    await this.useCase.execute();
  }

  onApplicationBootstrap() {
    this._intervalId = setInterval(() => this.handle(), 1);
  }

  onApplicationShutdown() {
    clearInterval(this._intervalId);
  }
}
