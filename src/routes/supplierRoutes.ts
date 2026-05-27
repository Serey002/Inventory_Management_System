import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

export function createSupplierRouter(
  supplierController: SupplierController,
): Router {
  const router = Router();

  router.get("/", supplierController.getAll);
  router.get("/search", supplierController.search);
  router.get("/:id", supplierController.getById);
  router.post("/", supplierController.create);
  router.put("/:id", supplierController.update);
  router.delete("/:id", supplierController.delete);

  return router;
}

export default createSupplierRouter;
