import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { BaseAuthService } from "../services/BaseAuthService";
import { LoginDTO, RegisterDTO } from "../types/authType";

export class AuthController extends BaseController {
  constructor(private readonly authService: BaseAuthService) {
    super();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginDTO = req.body;
    if (!email || !password) {
      this.sendError(res, "Email and password are required");
      return;
    }
    try {
      this.sendSuccess(res, await this.authService.login(email, password));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Login failed"), 401);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const data: RegisterDTO = req.body;
    if (!data.name || !data.email || !data.password) {
      this.sendError(res, "Name, email, and password are required");
      return;
    }
    if (data.password.length < 6) {
      this.sendError(res, "Password must be at least 6 characters");
      return;
    }
    try {
      this.sendCreated(res, await this.authService.register(data));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Registration failed"), 400);
    }
  };
}

export default AuthController;