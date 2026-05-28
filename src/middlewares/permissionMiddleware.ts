import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types/authType";

type PermissionErrorCode = "NO_AUTH_USER" | "INSUFFICIENT_PERMISSIONS";

interface PermissionErrorResponse extends ErrorResponse {
  code: PermissionErrorCode;
}

const permissionAliases: Record<string, string[]> = {
  "inventory:update": ["manage_inventory"],
  "inventory:view":   ["manage_inventory"],
  "product:create":   ["create_product"],
  "product:delete":   ["delete_product"],
  "product:update":   ["edit_product"],
  "product:view":     ["view_product"],
  "sale:create":      ["create_sale"],
  "sale:view":        ["view_reports"],
  "user:create":      ["manage_users"],
  "user:delete":      ["manage_users"],
  "user:update":      ["manage_users"],
  "user:view":        ["manage_users"],
};

const hasPermission = (permissions: string[], required: string): boolean =>
  permissions.includes(required) ||
  (permissionAliases[required] ?? []).some((alias) => permissions.includes(alias));

const sendError = (res: Response, status: number, code: PermissionErrorCode, message: string): void => {
  res.status(status).json({ success: false, message, code, statusCode: status } satisfies PermissionErrorResponse);
};

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const withUserPermissions =
  (check: (userPermissions: string[]) => boolean, errorMessage: string): Middleware =>
  (req, res, next) => {
    if (!req.user) {
      sendError(res, 401, "NO_AUTH_USER", "Authentication required");
      return;
    }

    const userPermissions = req.user.role?.permissions ?? [];
    if (!check(userPermissions)) {
      sendError(res, 403, "INSUFFICIENT_PERMISSIONS", errorMessage);
      return;
    }

    next();
  };

export const createPermissionMiddleware = (required: string): Middleware =>
  withUserPermissions(
    (perms) => hasPermission(perms, required),
    `Permission required: ${required}`,
  );

export const createPermissionMiddlewareAny = (required: string[]): Middleware =>
  withUserPermissions(
    (perms) => required.some((p) => hasPermission(perms, p)),
    `One of the following permissions required: ${required.join(", ")}`,
  );

export default createPermissionMiddleware;