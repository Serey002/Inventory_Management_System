import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";
import { Users } from "../Entities/Users";
import { AppError, ValidationError, NotFoundError, ConflictError } from "../errors/AppError";

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  /**
   * Get all users (admin only)
   */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAll();
      this.sendSuccess(res, users);
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to fetch users"), 500);
    }
  };

  /**
   * Get user by ID (owner or admin only)
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID", 400);
      return;
    }

    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        this.sendError(res, "User not found", 404);
        return;
      }
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to fetch user"), 500);
    }
  };

  /**
   * Create user (admin only)
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      this.sendError(res, "Name, email, and password are required", 400);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.sendError(res, "Invalid email format", 400);
      return;
    }

    try {
      const user = await this.userService.createUser(req.body as Partial<Users>);
      this.sendCreated(res, user);
    } catch (error) {
      if (error instanceof ValidationError) {
        this.sendError(res, error.message, 400);
      } else if (error instanceof ConflictError) {
        this.sendError(res, error.message, 409);
      } else if (error instanceof AppError) {
        this.sendError(res, error.message, error.statusCode);
      } else {
        this.sendError(res, this.resolveError(error, "Failed to create user"), 500);
      }
    }
  };

  /**
   * Update user (owner or admin only)
   */
  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID", 400);
      return;
    }

    try {
      const user = await this.userService.updateUser(id, req.body as Partial<Users>);
      if (!user) {
        this.sendError(res, "User not found", 404);
        return;
      }
      this.sendSuccess(res, user);
    } catch (error) {
      if (error instanceof ValidationError) {
        this.sendError(res, error.message, 400);
      } else if (error instanceof NotFoundError) {
        this.sendError(res, error.message, 404);
      } else if (error instanceof AppError) {
        this.sendError(res, error.message, error.statusCode);
      } else {
        this.sendError(res, this.resolveError(error, "Failed to update user"), 500);
      }
    }
  };

  /**
   * Delete user (admin only)
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID", 400);
      return;
    }

    try {
      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        this.sendError(res, "User not found", 404);
        return;
      }
      this.sendSuccess(res, { message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.sendError(res, error.message, 404);
      } else if (error instanceof AppError) {
        this.sendError(res, error.message, error.statusCode);
      } else {
        this.sendError(res, this.resolveError(error, "Failed to delete user"), 500);
      }
    }
  };
}

export default UserController;
