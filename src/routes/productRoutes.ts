import { RequestHandler, Router } from "express";
import { ProductController } from "../controllers/ProductController";

export function createProductRouter(
  productController: ProductController,
  authMiddleware?: RequestHandler,
  permissionMiddleware?: (permission: string) => RequestHandler,
): Router {
  const router = Router();
  const requirePermission = (permission: string): RequestHandler[] =>
    authMiddleware && permissionMiddleware
      ? [authMiddleware, permissionMiddleware(permission)]
      : [];

  router.get("/", ...requirePermission("product:view"), productController.getAll);
  router.get("/:id", ...requirePermission("product:view"), productController.getById);
  router.post("/", ...requirePermission("product:create"), productController.create);
  router.put("/:id", ...requirePermission("product:update"), productController.update);
  router.delete("/:id", ...requirePermission("product:delete"), productController.delete);

  return router;
}

export default createProductRouter;
