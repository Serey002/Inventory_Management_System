import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export function createProductRouter(productController: ProductController): Router {
  const router = Router();

  router.get("/", productController.getAll);
  router.get("/:id", productController.getById);
  router.post("/", productController.create);
  router.put("/:id", productController.update);
  router.delete("/:id", productController.delete);

  return router;
}

export default createProductRouter;
