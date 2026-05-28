import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { isAdmin, isOwnerOrAdmin, isAuthenticated } from "../middlewares/authorizationMiddleware";
import { BaseAuthService } from "../services/BaseAuthService";

export function createUserRouter(
  userController: UserController,
  authService: BaseAuthService,
): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(authService);

  /**
   * All routes require authentication
   */
  router.use(authenticate);

  /**
   * GET /api/users
   * Get all users (admin only)
   */
  router.get("/", isAdmin, userController.getAll);

  /**
   * GET /api/users/:id
   * Get user by ID (owner or admin)
   */
  router.get("/:id", isOwnerOrAdmin, userController.getById);

  /**
   * POST /api/users
   * Create user (admin only)
   */
  router.post("/", isAdmin, userController.create);

  /**
   * PUT /api/users/:id
   * Update user (owner or admin)
   */
  router.put("/:id", isOwnerOrAdmin, userController.update);

  /**
   * DELETE /api/users/:id
   * Delete user (admin only)
   */
  router.delete("/:id", isAdmin, userController.delete);

  return router;
}

export default createUserRouter;
