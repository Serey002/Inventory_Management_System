// src/routes/userRoutes.ts

import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";

export function createUserRouter(
  userController: UserController,
  authMiddleware?: RequestHandler,
  permissionMiddleware?: (permission: string) => RequestHandler,
): Router {
  const router = Router();

  const requirePermission = (permission: string): RequestHandler[] => {
    if (!authMiddleware || !permissionMiddleware) return [];
    return [authMiddleware, permissionMiddleware(permission)];
  };

  router.get("/", ...requirePermission("user:view"), userController.getAll);
  router.get("/:id", ...requirePermission("user:view"), userController.getById);
  router.post("/", ...requirePermission("user:create"), userController.create);
  router.put("/:id", ...requirePermission("user:update"), userController.update);
  router.delete("/:id", ...requirePermission("user:delete"), userController.delete);

  return router;
}

export default createUserRouter;