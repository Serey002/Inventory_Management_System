export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string | null;
}