import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource }    from "./config/database";
import { UserRepository }   from "./repositories/UserRepository";
import { RoleRepository }   from "./repositories/RoleRepository";
import { AuthService }      from "./services/AuthService";
import { UserService }      from "./services/UserService";
import { AuthController }   from "./controllers/AuthController";
import { UserController }   from "./controllers/UserController";
import { createAuthRouter } from "./routes/authRoutes";
import { ProductController } from "./controllers/ProductController";
import { createProductRouter } from "./routes/productRoutes";
import { ProductRepository } from "./repositories/ProductRepository";
import { ProductService } from "./services/ProductService";
import { createUserRouter } from "./routes/UserRoutes";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Bootstrap ─────────────────────────────────────────────────────────────────
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");

    const userRepository = new UserRepository(AppDataSource);
    const roleRepository = new RoleRepository(AppDataSource);
    const authService    = new AuthService(userRepository, roleRepository);
    const userService    = new UserService(userRepository);
    const authController = new AuthController(authService);
    const userController = new UserController(userService);
    const productRepository = new ProductRepository(AppDataSource);
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);
   

    // ── Routes ───────────────────────────────────────────────────────────────
    app.use("/api/auth",  createAuthRouter(authController, authService));
    app.use("/api/products", createProductRouter(productController));
    app.use("/api/users", createUserRouter(userController));
    app.get("/api/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    app.get("/api/health", (_req, res) =>
      res.json({ status: "ok", timestamp: new Date().toISOString() }),
    );
  });
