import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types/authType";

type PermissionErrorCode = "NO_AUTH_USER" | "INSUFFICIENT_PERMISSIONS";

interface PermissionErrorResponse extends ErrorResponse {
  code: PermissionErrorCode;
}

const permissionAliases: Record<string, string[]> = {
  "inventory:update": ["manage_inventory"],
  "inventory:view": ["manage_inventory"],
  "product:create": ["create_product"],
  "product:delete": ["delete_product"],
  "product:update": ["edit_product"],
  "product:view": ["view_product"],
  "sale:create": ["create_sale"],
  "sale:view": ["view_reports"],
  "user:create": ["manage_users"],
  "user:delete": ["manage_users"],
  "user:update": ["manage_users"],
  "user:view": ["manage_users"],
};

const hasPermission = (permissions: string[], requiredPermission: string): boolean =>
  permissions.includes(requiredPermission) ||
  (permissionAliases[requiredPermission] ?? []).some((alias) => permissions.includes(alias));

export const createPermissionMiddleware =
  (requiredPermission: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // This middleware assumes authMiddleware has already run
    // and populated req.user with JWT payload

    if (!req.user) {
      const response: PermissionErrorResponse = {
        success: false,
        message: "Authentication required",
        code: "NO_AUTH_USER",
        statusCode: 401,
      };
      res.status(401).json(response);
      return;
    }

    const permissions = req.user.role?.permissions ?? [];
    if (!hasPermission(permissions, requiredPermission)) {
      const response: PermissionErrorResponse = {
        success: false,
        message: `You do not have permission to perform this action. Required: ${requiredPermission}`,
        code: "INSUFFICIENT_PERMISSIONS",
        statusCode: 403,
      };
      res.status(403).json(response);
      return;
    }

    next();
  };

export const createPermissionMiddlewareAny =
  (permissions: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: PermissionErrorResponse = {
        success: false,
        message: "Authentication required",
        code: "NO_AUTH_USER",
        statusCode: 401,
      };
      res.status(401).json(response);
      return;
    }

    const userPermissions = req.user.role?.permissions ?? [];
    const hasAnyPermission = permissions.some((p) => hasPermission(userPermissions, p));

    if (!hasAnyPermission) {
      const response: PermissionErrorResponse = {
        success: false,
        message: `You do not have permission to perform this action. Required one of: ${permissions.join(", ")}`,
        code: "INSUFFICIENT_PERMISSIONS",
        statusCode: 403,
      };
      res.status(403).json(response);
      return;
    }

    next();
  };

export default createPermissionMiddleware;
