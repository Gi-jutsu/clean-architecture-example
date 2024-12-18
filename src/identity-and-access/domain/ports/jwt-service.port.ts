export interface JwtService {
  sign(payload: Record<string, unknown>): string;
}

export const JwtServiceToken = Symbol("JwtService");
