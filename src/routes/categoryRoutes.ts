import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

export function createCategoryRouter(categoryController: CategoryController): Router {
  const router = Router();

  router.get("/", categoryController.getAll);
  router.get("/:id", categoryController.getById);
  router.post("/", categoryController.create);
  router.put("/:id", categoryController.update);
  router.delete("/:id", categoryController.delete);

  return router;
}

export default createCategoryRouter;
