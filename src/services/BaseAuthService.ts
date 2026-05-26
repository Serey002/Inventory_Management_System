import { RegisterDTO, AuthResult, JwtPayload } from "../types/authType";

export abstract class BaseAuthService {
  abstract login(email: string, password: string): Promise<AuthResult>;
  abstract register(data: RegisterDTO): Promise<AuthResult>;
  abstract validateToken(token: string): JwtPayload;
}