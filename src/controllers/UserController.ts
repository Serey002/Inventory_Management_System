import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";
import { User } from "../Entities/Users";

export class UserController extends BaseController {
  private static readonly SALT_ROUNDS = 12;

  constructor(private readonly userService: UserService) {
    super();
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.userService.getAll());
    } catch (error) {
      this.sendError(
        res,
        this.resolveError(error, "Failed to fetch users"),
        500,
      );
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = UserController.parseId(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );
    if (id === null) {
      this.sendError(res, "Invalid user ID");
      return;
    }

    try {
      const user = await this.userService.getUserById(id);
      user ? this.sendSuccess(res, user) : this.sendNotFound(res, "User");
    } catch (error) {
      this.sendError(
        res,
        this.resolveError(error, "Failed to fetch user"),
        500,
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data: Partial<User> = req.body ?? {};
    const validationError = UserController.validateCreate(data);

    if (validationError) {
      this.sendError(res, validationError);
      return;
    }

    try {
      const user = await UserController.buildUser(data);
      this.sendCreated(res, await this.userService.createUser(user));
    } catch (error) {
      this.sendError(
        res,
        this.resolveError(error, "Failed to create user"),
        400,
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = UserController.parseId(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );
    if (id === null) {
      this.sendError(res, "Invalid user ID");
      return;
    }

    try {
      const updated = await this.userService.updateUser(id, req.body);
      updated ? this.sendSuccess(res, updated) : this.sendNotFound(res, "User");
    } catch (error) {
      this.sendError(
        res,
        this.resolveError(error, "Failed to update user"),
        400,
      );
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = UserController.parseId(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );
    if (id === null) {
      this.sendError(res, "Invalid user ID");
      return;
    }

    try {
      const deleted = await this.userService.deleteUser(id);
      deleted
        ? this.sendSuccess(res, { message: "User deleted successfully" })
        : this.sendNotFound(res, "User");
    } catch (error) {
      this.sendError(
        res,
        this.resolveError(error, "Failed to delete user"),
        400,
      );
    }
  };

  // ── Private static helpers ────────────────────────────────────────────────

  private static validateCreate(data: Partial<User>): string | null {
    if (!data.name || !data.email || !data.password)
      return "Name, email, and password are required";
    if ((data.password as string).length < 6)
      return "Password must be at least 6 characters";
    return null;
  }

  private static parseId(raw: string): number | null {
    const id = parseInt(raw, 10);
    return isNaN(id) ? null : id;
  }

  private static async buildUser(data: Partial<User>): Promise<User> {
    const user = Object.assign(new User(), data);
    user.password = await bcrypt.hash(
      data.password as string,
      UserController.SALT_ROUNDS,
    );
    return user;
  }
}
