import "reflect-metadata";
import { DataSource } from "typeorm";

import { Role } from "../Entity/Role";
import { User } from "../Entity/User";
import { Category } from "../Entity/Category";
import { Supplier } from "../Entity/Supplier";
import { Warehouse } from "../Entity/Warehouse";
import { Product } from "../Entity/Product";
import { Inventory } from "../Entity/Inventory";
import { StockMovement } from "../Entity/StockMovement";
import { Sale } from "../Entity/Sale";
import { SaleItem } from "../Entity/SaleItem";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "ims_db",
  synchronize: true,
  logging: false,
  entities: [
    Role,
    User,
    Category,
    Supplier,
    Warehouse,
    Product,
    Inventory,
    StockMovement,
    Sale,
    SaleItem,
  ],
});
