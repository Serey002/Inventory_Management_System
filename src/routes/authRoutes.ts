import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/login",    authController.login);
  router.post("/register", authController.register);

  return router;
}

export default createAuthRouter;