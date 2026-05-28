import { RequestHandler, Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

export function createSupplierRouter(
  supplierController: SupplierController,
  authMiddleware?: RequestHandler,
): Router {
  const router = Router();
  const requireAuth = (): RequestHandler[] =>
    authMiddleware ? [authMiddleware] : [];

  router.get("/", ...requireAuth(), supplierController.getAll);
  router.get("/search", ...requireAuth(), supplierController.search);
  router.get("/:id", ...requireAuth(), supplierController.getById);
  router.post("/", ...requireAuth(), supplierController.create);
  router.put("/:id", ...requireAuth(), supplierController.update);
  router.delete("/:id", ...requireAuth(), supplierController.delete);

  return router;
}

export default createSupplierRouter;
