import "reflect-metadata";
import { DataSource } from "typeorm";

import { Roles } from "../Entity/Roles";
import { Users } from "../Entity/Users";
import { Categories } from "../Entity/Categories";
import { Supplier } from "../Entity/Supplier";
import { Warehouse } from "../Entity/Warehouse";
import { Products } from "../Entity/Products";
import { Inventories } from "../Entity/Inventories";
import { StockMovement } from "../Entity/StockMovement";
import { Sale } from "../Entity/Sale";
import { SaleItem } from "../Entity/SaleItem";

export const AppDataSource = new DataSource({
  type: "mysql",

  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ims_db",

  synchronize: true,
  logging: false,

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

});