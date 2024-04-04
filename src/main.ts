export interface Logger {
  log(...args: any[]): void;
}

export function main(logger: Logger): void {
  logger.log("Hello, world!");
}
