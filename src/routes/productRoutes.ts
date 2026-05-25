import { Router, RequestHandler } from "express";
import { ProductController } from "../controllers/ProductController";

export function createProductRouter(
  productController: ProductController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", productController.getAll);
  router.get("/:id", productController.getById);
  router.post("/", productController.create);
  router.put("/:id", productController.update);
  router.delete("/:id", productController.delete);

  return router;
}

export default createProductRouter;
