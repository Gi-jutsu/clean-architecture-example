export interface JwtService {
  sign(payload: Record<string, any>, secret: string): string;
}

export const JwtServiceToken = Symbol.for("JwtService");
