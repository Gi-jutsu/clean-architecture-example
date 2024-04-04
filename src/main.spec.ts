import { describe, expect, it } from "vitest";
import { type Logger, main } from "./main";

class StubLogger implements Logger {
  public hasLogBeenCalled = false;

  log() {
    this.hasLogBeenCalled = true;
  }
}

describe("main", () => {
  it('should log "Hello, world!"', () => {
    // Arrange
    const logger = new StubLogger();

    // Act
    main(logger);

    // Assert
    expect(logger.hasLogBeenCalled).toEqual(true);
  });
});
