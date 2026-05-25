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

export interface JwtPayload {
  userId: number;
  email: string;
  role: string | null;
}

export interface AuthResult {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string | null;
    isActive: boolean;
  };
}

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