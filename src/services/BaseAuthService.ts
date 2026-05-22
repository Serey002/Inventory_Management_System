
export abstract class BaseAuthService {
  abstract login(email: string, password: string): Promise<unknown>;
  abstract register(data: unknown): Promise<unknown>;
  abstract validateToken(token: string): unknown;
}