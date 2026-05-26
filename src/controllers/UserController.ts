import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";
import { Users } from "../Entities/Users";

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.userService.getAll());
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to get users"), 500);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID");
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
      this.sendError(res, this.resolveError(error, "Failed to get user"), 500);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      this.sendError(res, "name, email and password are required");
      return;
    }
    try {
      this.sendCreated(res, await this.userService.createUser(req.body as Users));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to create user"), 500);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID");
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
      this.sendError(res, this.resolveError(error, "Failed to update user"), 500);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid user ID");
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
      this.sendError(res, this.resolveError(error, "Failed to delete user"), 500);
    }
  };
}

export default UserController;
