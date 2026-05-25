import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";

export function createAuthRouter(authController: AuthController, authService: AuthService): Router {
  const router = Router();

  router.post("/login", authController.login);
  router.post("/register", authController.register);

  return router;
}