import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  // Public routes
  router.post("/login", authController.login);
  router.post("/register", authController.register);

  // Protected routes
  router.get("/profile", authMiddleware, authController.getProfile);

  return router;
}