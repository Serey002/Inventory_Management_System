import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Role } from "../Entities/Roles";
import { Users } from "../Entities/Users";
import { Categories } from "../Entities/Categories";
import { Supplier } from "../Entities/Supplier";
import { Warehouse } from "../Entities/Warehouse";
import { Products } from "../Entities/Products";
import { Inventories } from "../Entities/Inventories";
import { StockMovement } from "../Entities/StockMovement";
import { Sale } from "../Entities/Sale";
import { SaleItem } from "../Entities/SaleItem";

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
    Role,
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