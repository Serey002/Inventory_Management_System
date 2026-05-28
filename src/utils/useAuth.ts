import { tokenManager, ApiClient } from "./tokenManager";

export const useAuth = () => ({
  isAuthenticated: tokenManager.hasValidToken(),

  user: tokenManager.getUser(),

  hasPermission: (permission: string): boolean =>
    tokenManager.hasPermission(permission),

  hasAnyPermission: (permissions: string[]): boolean =>
    tokenManager.hasAnyPermission(permissions),

  login: async (email: string, password: string) => {
    try {
      const response = await new ApiClient().post<any>("/auth/login", { email, password });
      tokenManager.setToken(response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },

  logout: () => tokenManager.clearToken(),

  getToken: (): string | null => tokenManager.getToken(),

  isTokenExpiringSoon: (): boolean => tokenManager.isTokenExpiringSoon(),
});

export default useAuth;