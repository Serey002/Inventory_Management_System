// ── Request DTOs ──────────────────────────────────────────────────────────────

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

// ── Response shapes ────────────────────────────────────────────────────────────

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: SafeRole | null;
  isActive: boolean;
}

export interface SafeRole {
  id: number;
  name: string;
  permissions: string[];
}

export interface AuthResult {
  token: string;
  user: SafeUser;
}

// ── Error Response ────────────────────────────────────────────────────────────

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  statusCode?: number;
}

export interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  email: string;
  role: SafeRole | null;
}

// ── Express augmentation ──────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
