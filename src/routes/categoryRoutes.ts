import { RequestHandler, Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

export function createCategoryRouter(
  categoryController: CategoryController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.get("/", authMiddleware, categoryController.getAll);
  router.get("/:id", authMiddleware, categoryController.getById);
  router.post("/", authMiddleware, categoryController.create);
  router.put("/:id", authMiddleware, categoryController.update);
  router.delete("/:id", authMiddleware, categoryController.delete);

  return router;
}

export default createCategoryRouter;
