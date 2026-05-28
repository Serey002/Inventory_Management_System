import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { AppDataSource }    from "./config/database";
import { UserRepository }   from "./repositories/UserRepository";
import { RoleRepository }   from "./repositories/RoleRepository";
import { AuthService }      from "./services/AuthService";
import { AuthController }   from "./controllers/AuthController";
import { createAuthRouter } from "./routes/authRoutes";
import { ProductController } from "./controllers/ProductController";
import { createProductRouter } from "./routes/productRoutes";
import { ProductRepository } from "./repositories/ProductRepository";
import { ProductService } from "./services/ProductService";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { createUserRouter } from "./routes/UserRoutes";
import { SupplierController } from "./controllers/SupplierController";
import { SupplierRepository } from "./repositories/SupplierRepository";
import { SupplierService } from "./services/SupplierService";
import { createSupplierRouter } from "./routes/supplierRoutes";
import { Users } from "./Entities/Users";
import { Role } from "./Entities/Roles";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Seed Data ──
async function seedDatabase(userRepository: UserRepository, roleRepository: RoleRepository): Promise<void> {
  try {
    // Create roles if they don't exist
    const adminRole = await roleRepository.findByName("admin");
    if (!adminRole) {
      const newAdminRole = new Role();
      newAdminRole.name = "admin";
      newAdminRole.description = "Administrator with full access";
      await roleRepository.save(newAdminRole);
      console.log("✅ Admin role created");
    }

    const staffRole = await roleRepository.findByName("staff");
    if (!staffRole) {
      const newStaffRole = new Role();
      newStaffRole.name = "staff";
      newStaffRole.description = "Staff member with limited access";
      await roleRepository.save(newStaffRole);
      console.log("✅ Staff role created");
    }

    // Create default admin user if it doesn't exist
    const defaultAdminEmail = "admin@example.com";
    const adminUser = await userRepository.findByEmail(defaultAdminEmail);
    
    if (!adminUser) {
      const defaultAdminPassword = "AdminPassword123";
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
      
      const newAdmin = new Users();
      newAdmin.name = "Administrator";
      newAdmin.email = defaultAdminEmail;
      newAdmin.password = hashedPassword;
      newAdmin.isActive = true;
      newAdmin.lastLoginAt = null;
      newAdmin.role = await roleRepository.findByName("admin");
      
      await userRepository.save(newAdmin);
      console.log("✅ Default admin created");
      console.log(`   📧 Email: ${defaultAdminEmail}`);
      console.log(`   🔐 Password: ${defaultAdminPassword}`);
      console.log("   ⚠️  Please change the default password in production");
    }
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
}

// ── Global middleware ────
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Bootstrap -
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
    const supplierRepository = new SupplierRepository(AppDataSource);
    const supplierService = new SupplierService(supplierRepository);
    const supplierController = new SupplierController(supplierService);

    // ── Routes ───────────────────────────────────────────────────────────────
    app.use("/api/auth",  createAuthRouter(authController));
    app.use("/api/users", createUserRouter(userController, authService));
    app.use("/api/products", createProductRouter(productController));
    app.use("/api/suppliers", createSupplierRouter(supplierController));
    app.get("/api/health", (_req, res) =>
      res.json({ status: "ok", timestamp: new Date().toISOString() }),
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
