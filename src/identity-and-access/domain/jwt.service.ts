export interface JwtService {
  sign(payload: Record<string, unknown>, secret: string): string;
}

export const JwtServiceToken = Symbol("JwtService");

export const createJwtService = async () =>
  (await import("jsonwebtoken")).default;
