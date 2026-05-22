import "reflect-metadata";
import { DataSource } from "typeorm";

import { Role } from "../Entities/Role";
import { User } from "../Entities/User";
import { Category } from "../Entities/Category";
import { Supplier } from "../Entities/Supplier";
import { Warehouse } from "../Entities/Warehouse";
import { Product } from "../Entities/Product";
import { Inventory } from "../Entities/Inventory";
import { StockMovement } from "../Entities/StockMovement";
import { Sale } from "../Entities/Sale";
import { SaleItem } from "../Entities/SaleItem";

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
