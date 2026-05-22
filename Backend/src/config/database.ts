import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Roles } from "../entities/Roles";
import { Users } from "../entities/Users";
import { Categories } from "../entities/Categories";
import { Supplier } from "../entities/Supplier";
import { Warehouse } from "../entities/Warehouse";
import { Products } from "../entities/Products";
import { Inventories } from "../entities/Inventories";
import { StockMovement } from "../entities/StockMovement";
import { Sale } from "../entities/Sale";
import { SaleItem } from "../entities/SaleItem";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ims_db",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  dropSchema: false,

  entities: [
    Roles,
    Users,
    Categories,
    Supplier,
    Warehouse,
    Products,
    Inventories,
    StockMovement,
    Sale,
    SaleItem,
  ],

  migrations: [],
  subscribers: [],
});
