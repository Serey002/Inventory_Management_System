import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AuthService } from "../services/AuthService";

export function createAuthRouter(authController: AuthController, authService: AuthService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.post("/login", authController.login);
  router.post("/register", authController.register);

  return router;
}