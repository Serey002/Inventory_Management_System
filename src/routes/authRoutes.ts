import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { BaseAuthService } from "../services/BaseAuthService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

export function createAuthRouter(
  authController: AuthController,
  authService: BaseAuthService,
): Router {
  const router = Router();
  const requireAuth = createAuthMiddleware(authService);

  router.post("/login",    authController.login);
  router.post("/register", authController.register);

  return router;
}