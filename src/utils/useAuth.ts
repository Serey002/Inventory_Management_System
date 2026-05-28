
import { tokenManager, ApiClient } from "./tokenManager";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  // Initial check: see if token exists
  const token = tokenManager.getToken();
  const user = tokenManager.getUser();

  return {
    /**
     * Check if user is authenticated
     */
    isAuthenticated: tokenManager.hasValidToken(),

    /**
     * Current user data from token
     */
    user: user,

    /**
     * Check if user has specific permission
     */
    hasPermission: (permission: string): boolean => {
      return tokenManager.hasPermission(permission);
    },

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission: (permissions: string[]): boolean => {
      return tokenManager.hasAnyPermission(permissions);
    },

    /**
     * Perform login
     * @param email User email
     * @param password User password
     * @returns User and token on success, throws on failure
     */
    login: async (email: string, password: string) => {
      const api = new ApiClient();
      try {
        const response = await api.post<any>("/auth/login", {
          email,
          password,
        });
        tokenManager.setToken(response.data);
        return response.data;
      } catch (error) {
        throw new Error(
          `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },

    /**
     * Perform logout
     */
    logout: () => {
      tokenManager.clearToken();
    },

    /**
     * Get current token (for debugging or custom API calls)
     */
    getToken: (): string | null => {
      return tokenManager.getToken();
    },

    /**
     * Check if token is about to expire
     */
    isTokenExpiringSoon: (): boolean => {
      return tokenManager.isTokenExpiringSoon();
    },
  };
};

export default useAuth;
