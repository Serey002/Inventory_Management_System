import { RequestHandler, Router } from "express";
import { WarehouseController } from "../controllers/WarehouseController";

export function createWarehouseRouter(
  warehouseController: WarehouseController,
  authMiddleware?: RequestHandler,
  permissionMiddleware?: (permission: string) => RequestHandler,
): Router {
  const router = Router();
  const requirePermission = (permission: string): RequestHandler[] =>
    authMiddleware && permissionMiddleware
      ? [authMiddleware, permissionMiddleware(permission)]
      : [];

  router.get("/",       ...requirePermission("warehouse:view"),    warehouseController.getAll);
  router.get("/:id",    ...requirePermission("warehouse:view"),    warehouseController.getById);
  router.post("/",      ...requirePermission("warehouse:create"),  warehouseController.create);
  router.put("/:id",    ...requirePermission("warehouse:update"),  warehouseController.update);
  router.delete("/:id", ...requirePermission("warehouse:delete"),  warehouseController.delete);

  return router;
}

export default createWarehouseRouter;