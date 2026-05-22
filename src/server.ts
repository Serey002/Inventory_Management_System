import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { UserRepository } from "./repositories/UserRepository";
import { RoleRepository } from "./repositories/RoleRepository";
import { AuthService } from "./services/AuthService";
import { AuthController } from "./controllers/AuthController";
import { createAuthRouter } from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Dependency injection — wire up the full chain
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");

    const userRepository = new UserRepository(AppDataSource);
    const roleRepository = new RoleRepository(AppDataSource);
    const authService = new AuthService(userRepository, roleRepository);
    const authController = new AuthController(authService);
    const authRouter = createAuthRouter(authController);

    // Mount routes
    app.use("/api/auth", authRouter);

    // Health check
    app.get("/api/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });