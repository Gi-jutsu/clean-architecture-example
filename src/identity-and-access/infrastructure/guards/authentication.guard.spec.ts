import { describe, expect, it, vi } from "vitest";
import { AuthenticationGuard } from "./authentication.guard.js";
import type { Reflector } from "@nestjs/core";
import type { ExecutionContext } from "@nestjs/common";

describe("AuthenticationGuard", () => {
  describe("when the route is decorated with @Public", () => {
    it("should allow unauthenticated users to access public routes", () => {
      // Given
      const { context, guard, mockHasPublicDecorator } =
        createSystemUnderTest();

      mockHasPublicDecorator(true);

      // When
      const isAllowed = guard.canActivate(context);

      // Then
      expect(isAllowed).toBe(true);
    });
  });

  it("should not allow unauthenticated users to access private routes", () => {
    // Given
    const { context, guard } = createSystemUnderTest();

    // When
    const isAllowed = guard.canActivate(context);

    // Then
    expect(isAllowed).toBe(false);
  });
});

function createSystemUnderTest() {
  const context = {
    getClass: () => vi.fn(),
    getHandler: () => vi.fn(),
  } as unknown as ExecutionContext;

  const reflector = {
    getAllAndOverride: vi.fn().mockReturnValue(false),
  };

  const guard = new AuthenticationGuard(reflector as unknown as Reflector);

  const mockHasPublicDecorator = (value: boolean) => {
    reflector.getAllAndOverride.mockReturnValueOnce(value);
  };

  return { context, guard, mockHasPublicDecorator };
}
