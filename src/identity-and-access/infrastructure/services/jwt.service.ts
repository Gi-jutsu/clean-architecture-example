export interface JwtService {
  sign(payload: Record<string, unknown>, secret: string): string;
}

export const JwtServiceToken = Symbol("JwtService");
