import "reflect-metadata";
import { AppDataSource } from "../config/database";
import { seedPermissions } from "./permissionSeeder";

AppDataSource.initialize()
  .then(async () => {
    await seedPermissions(AppDataSource);
    console.log("Permissions seeded successfully");
  })
  .catch((error) => {
    console.error("Failed to seed permissions:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });
