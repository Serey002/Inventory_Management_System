import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/authType";

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }
  next();
};

/**
 * Check if user has specific role
 */
export const hasRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }

    next();
  };
};

/**
 * Check if user is accessing their own resource or is admin
 */
export const isOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const targetUserId = parseInt(req.params.id as string);
  const isOwner = req.user.userId === targetUserId;
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    res.status(403).json({ success: false, message: "You can only access your own data" });
    return;
  }

  next();
};

/**
 * Check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  if (req.user.role !== "Admin") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }

  next();
};
