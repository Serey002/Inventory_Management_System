import { RequestHandler, Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

export function createCategoryRouter(
  categoryController: CategoryController,
  authMiddleware?: RequestHandler,
  permissionMiddleware?: (permission: string) => RequestHandler,
): Router {
  const router = Router();
  const requirePermission = (permission: string): RequestHandler[] =>
    authMiddleware && permissionMiddleware
      ? [authMiddleware, permissionMiddleware(permission)]
      : [];

  router.get("/",       ...requirePermission("category:view"),    categoryController.getAll);
  router.get("/:id",    ...requirePermission("category:view"),    categoryController.getById);
  router.post("/",      ...requirePermission("category:create"),  categoryController.create);
  router.put("/:id",    ...requirePermission("category:update"),  categoryController.update);
  router.delete("/:id", ...requirePermission("category:delete"),  categoryController.delete);

  return router;
}

export default createCategoryRouter;