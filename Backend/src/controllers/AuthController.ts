import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AuthService } from "../services/AuthService";
import { LoginDTO, RegisterDTO } from "../types/authType";

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginDTO = req.body;

      if (!email || !password) {
        this.sendError(res, "Email and password are required");
        return;
      }

      const result = await this.authService.login(email, password);
      this.sendSuccess(res, result, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      this.sendError(res, message, 401);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterDTO = req.body;

      if (!data.name || !data.email || !data.password) {
        this.sendError(res, "Name, email and password are required");
        return;
      }

      if (data.password.length < 6) {
        this.sendError(res, "Password must be at least 6 characters");
        return;
      }

      const result = await this.authService.register(data);
      this.sendCreated(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      this.sendError(res, message, 400);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const profile = await this.authService.getProfile(userId);
      this.sendSuccess(res, profile);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get profile";
      this.sendError(res, message, 404);
    }
  };
}