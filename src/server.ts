import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import { UserRepository } from "./repositories/UserRepository";
import { RoleRepository } from "./repositories/RoleRepository";
import { AuthService } from "./services/AuthService";
import { AuthController } from "./controllers/AuthController";
import { createAuthRouter } from "./routes/authRoutes";
import { createAuthMiddleware } from "./middlewares/authMiddleware";
import { createPermissionMiddleware } from "./middlewares/permissionMiddleware";
import { ProductController } from "./controllers/ProductController";
import { createProductRouter } from "./routes/productRoutes";
import { ProductRepository } from "./repositories/ProductRepository";
import { ProductService } from "./services/ProductService";
import { UserController } from "./controllers/UserController";
import { createUserRouter } from "./routes/userRoutes";
import { UserService } from "./services/UserService";
import { SupplierController } from "./controllers/SupplierController";
import { SupplierRepository } from "./repositories/SupplierRepository";
import { SupplierService } from "./services/SupplierService";
import { createSupplierRouter } from "./routes/supplierRoutes";
import { CategoryController } from "./controllers/CategoryController";
import { createCategoryRouter } from "./routes/categoryRoutes";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { seedPermissions } from "./seeders/permissionSeeder";
import { createWarehouseRouter } from "./routes/warehouseRoutes";
import { WarehouseController } from "./controllers/WarehouseController";
import { WarehouseService } from "./services/WarehouseService";
import { WarehouseRepository } from "./repositories/WarehouseRepository";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");

    if (process.env.SEED_PERMISSIONS_ON_STARTUP === "true") {
      await seedPermissions(AppDataSource);
      console.log("Permissions seeded");
    }

    const userRepository = new UserRepository(AppDataSource);
    const roleRepository = new RoleRepository(AppDataSource);
    const authService = new AuthService(userRepository, roleRepository);
    const userService = new UserService(userRepository);
    const authController = new AuthController(authService);
    const userController = new UserController(userService);
    const permissionMiddleware = createPermissionMiddleware;
    const authMiddleware = createAuthMiddleware(authService);
    const productRepository = new ProductRepository(AppDataSource);
    const categoryRepository = new CategoryRepository(AppDataSource);
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);
    const supplierRepository = new SupplierRepository(AppDataSource);
    const supplierService = new SupplierService(supplierRepository);
    const supplierController = new SupplierController(supplierService);
    const categoryController = new CategoryController(categoryRepository);
    const warehouseRepository = new WarehouseRepository(AppDataSource);
    const warehouseService = new WarehouseService(warehouseRepository);
    const warehouseController = new WarehouseController(warehouseService);

    // ── Routes ───────────────────────────────────────────────────────────────
    app.use("/api/auth",  createAuthRouter(authController));
    app.use("/api/products", createProductRouter(productController));
    app.use("/api/suppliers", createSupplierRouter(supplierController));
    app.use("/api/categories", createCategoryRouter(categoryController));
    app.use("/api/users", createUserRouter(userController, authMiddleware, permissionMiddleware));
    app.use("/api/warehouses", createWarehouseRouter(warehouseController, authMiddleware, permissionMiddleware));
    app.get("/api/health", (_req, res) =>
      res.json({ status: "ok", timestamp: new Date().toISOString() }),
    );

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
