"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const UserRepository_1 = require("./repositories/UserRepository");
const RoleRepository_1 = require("./repositories/RoleRepository");
const AuthService_1 = require("./services/AuthService");
const UserService_1 = require("./services/UserService");
const AuthController_1 = require("./controllers/AuthController");
const authRoutes_1 = require("./routes/authRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected");
    const userRepository = new UserRepository_1.UserRepository(database_1.AppDataSource);
    const roleRepository = new RoleRepository_1.RoleRepository(database_1.AppDataSource);
    const authService = new AuthService_1.AuthService(userRepository, roleRepository);
    const userService = new UserService_1.UserService(userRepository);
    const authController = new AuthController_1.AuthController(authService);
    app.use("/api/auth", (0, authRoutes_1.createAuthRouter)(authController, authService));
    app.get("/api/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    void userService;
})
    .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
