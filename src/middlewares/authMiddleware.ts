import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, ErrorResponse } from "../types/authType";
import { BaseAuthService } from "../services/BaseAuthService";

type ErrorCode = "NO_TOKEN" | "TOKEN_EXPIRED" | "INVALID_TOKEN" | "AUTH_FAILED";

interface AuthErrorResponse extends ErrorResponse {
  code: ErrorCode;
}

abstract class BaseAuthMiddleware {
  handle = (req: Request, res: Response, next: NextFunction): void => {
    const token = this.extractToken(req);

    if (!token) {
      res.status(401).json({ success: false, message: "No token provided", code: "NO_TOKEN", statusCode: 401 } satisfies AuthErrorResponse);
      return;
    }

    try {
      req.user = this.authenticate(token);
      next();
    } catch (error) {
      const { message, code } = this.resolveError(error);
      res.status(401).json({ success: false, message, code, statusCode: 401 } satisfies AuthErrorResponse);
    }
  };

  protected abstract authenticate(token: string): JwtPayload;

  protected extractToken(req: Request): string | null {
    const header = req.headers.authorization;
    return header?.startsWith("Bearer ") ? header.slice(7) : null;
  }

  protected resolveError(error: unknown): { message: string; code: ErrorCode } {
    if (error instanceof jwt.TokenExpiredError)  return { message: "Token has expired",       code: "TOKEN_EXPIRED" };
    if (error instanceof jwt.JsonWebTokenError)  return { message: "Invalid token",           code: "INVALID_TOKEN" };
                                                 return { message: "Authentication failed",   code: "AUTH_FAILED"   };
  }
}

class JwtAuthMiddleware extends BaseAuthMiddleware {
  constructor(private readonly authService: BaseAuthService) {
    super();
  }

  protected authenticate(token: string): JwtPayload {
    return this.authService.validateToken(token);
  }
}

export const createAuthMiddleware = (authService: BaseAuthService) =>
  new JwtAuthMiddleware(authService).handle;

export default createAuthMiddleware;