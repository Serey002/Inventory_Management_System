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
  role: string | null;
  isActive: boolean;
}

export interface AuthResult {
  token: string;
  user: SafeUser;
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  email: string;
  role: string | null;
}

// ── Express augmentation ──────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}