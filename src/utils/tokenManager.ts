interface TokenResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
      permissions: string[];
    } | null;
    isActive: boolean;
  };
}

class TokenManager {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  /**
   * Store token and user after login
   */
  public setToken(response: TokenResponse): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  }

  /**
   * Get stored token
   */
  public getToken(): string | null {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(this.TOKEN_KEY);
      }
      return null;
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }

  /**
   * Get stored user info
   */
  public getUser() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
      }
      return null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  }

  /**
   * Check if token exists (should be called on app init)
   */
  public hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  /**
   * Check if user has specific permission
   */
  public hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user?.role?.permissions) return false;
    return user.role.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  public hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Get Bearer token for API requests
   */
  public getBearerToken(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Clear token and user (logout)
   */
  public clearToken(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  }

  public isTokenExpiringSoon(): boolean {
    // In a production app, decode the JWT and check expiration time
    // This is a placeholder - you'd need to add jwt_decode library
    return false;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

export class ApiClient {
  private readonly baseURL: string;

  constructor(baseURL?: string) {
    // Get base URL from parameter, env, or default
    if (baseURL) {
      this.baseURL = baseURL;
    } else if (
      typeof window !== "undefined" &&
      (window as any).import?.meta?.env?.VITE_API_URL
    ) {
      this.baseURL = (window as any).import.meta.env.VITE_API_URL;
    } else {
      this.baseURL = "http://localhost:3001";
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenManager.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If 401, token is invalid/expired - redirect to login
    if (response.status === 401) {
      tokenManager.clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized: redirecting to login");
    }

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(
          (error as Record<string, string>).message || "API request failed",
        );
      } catch {
        throw new Error("API request failed");
      }
    }

    return response.json() as Promise<T>;
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  public post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export default tokenManager;
