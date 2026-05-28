import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Role } from "../Entities/Roles";
import { Users } from "../Entities/Users";
import { Category } from "../Entities/Categories";
import { Supplier } from "../Entities/Supplier";
import { Warehouse } from "../Entities/Warehouse";
import { Product } from "../Entities/Products";
import { Inventory } from "../Entities/Inventories";
import { StockMovement } from "../Entities/StockMovement";
import { Sale } from "../Entities/Sale";
import { SaleItem } from "../Entities/SaleItem";
import { Permission } from "../Entities/Permissions";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";
const shouldDropSchema = process.env.DB_DROP_SCHEMA === "true";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ims_db",
  synchronize: isDev,
  logging: isDev,
  dropSchema: shouldDropSchema,
  entities: [
    Role,
    Users,
    Category,
    Supplier,
    Warehouse,
    Product,
    Inventory,
    StockMovement,
    Sale,
    SaleItem,
    Permission,
  ],
  migrations: [],
  subscribers: [],
});
