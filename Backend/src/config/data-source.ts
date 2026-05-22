import "reflect-metadata";
import { DataSource } from "typeorm";

import { Roles } from "../Entities/Roles";
import { Users } from "../Entities/Users";
import { Categories } from "../Entities/Categories";
import { Supplier } from "../Entities/Supplier";
import { Warehouse } from "../Entities/Warehouse";
import { Products } from "../Entities/Products";
import { Inventories } from "../Entities/Inventories";
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
