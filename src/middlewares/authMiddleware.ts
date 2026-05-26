import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/authType";
import { BaseAuthService } from "../services/BaseAuthService";
abstract class BaseAuthMiddleware {
  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const token = this.extractToken(req);

    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    try {
      req.user = this.authenticate(token);
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: this.resolveError(error) });
    }
  };

  protected abstract authenticate(token: string): JwtPayload;

  protected extractToken(req: Request): string | null {
    const header = req.headers.authorization;
    return header?.startsWith("Bearer ") ? header.slice(7) : null;
  }

  protected resolveError(error: unknown): string {
    if (error instanceof jwt.TokenExpiredError) return "Token has expired";
    if (error instanceof jwt.JsonWebTokenError)  return "Invalid token";
    return "Authentication failed";
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