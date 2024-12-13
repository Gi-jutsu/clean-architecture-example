export interface Jwt {
  sign(payload: Record<string, unknown>, secret: string): string;
}

export const JwtToken = Symbol("Jwt");
