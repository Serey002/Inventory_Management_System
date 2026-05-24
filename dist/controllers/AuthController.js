"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const BaseController_1 = require("./BaseController");
class AuthController extends BaseController_1.BaseController {
    constructor(authService) {
        super();
        this.authService = authService;
        this.login = async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                this.sendError(res, "Email and password are required");
                return;
            }
            try {
                this.sendSuccess(res, await this.authService.login(email, password));
            }
            catch (error) {
                this.sendError(res, this.resolveError(error, "Login failed"), 401);
            }
        };
        this.register = async (req, res) => {
            const data = req.body;
            if (!data.name || !data.email || !data.password) {
                this.sendError(res, "Name, email and password are required");
                return;
            }
            if (data.password.length < 6) {
                this.sendError(res, "Password must be at least 6 characters");
                return;
            }
            try {
                this.sendCreated(res, await this.authService.register(data));
            }
            catch (error) {
                this.sendError(res, this.resolveError(error, "Registration failed"), 400);
            }
        };
        this.getProfile = async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                this.sendError(res, "Unauthorized", 401);
                return;
            }
            try {
                this.sendSuccess(res, await this.authService.getProfile(userId));
            }
            catch (error) {
                this.sendError(res, this.resolveError(error, "Failed to get profile"), 404);
            }
        };
    }
}
exports.AuthController = AuthController;
