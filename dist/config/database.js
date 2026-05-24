"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const Roles_1 = require("../Entities/Roles");
const Users_1 = require("../Entities/Users");
const Categories_1 = require("../Entities/Categories");
const Supplier_1 = require("../Entities/Supplier");
const Warehouse_1 = require("../Entities/Warehouse");
const Products_1 = require("../Entities/Products");
const Inventories_1 = require("../Entities/Inventories");
const StockMovement_1 = require("../Entities/StockMovement");
const Sale_1 = require("../Entities/Sale");
const SaleItem_1 = require("../Entities/SaleItem");
// Load environment variables
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
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
        Roles_1.Role,
        Users_1.Users,
        Categories_1.Categories,
        Supplier_1.Supplier,
        Warehouse_1.Warehouse,
        Products_1.Products,
        Inventories_1.Inventories,
        StockMovement_1.StockMovement,
        Sale_1.Sale,
        SaleItem_1.SaleItem,
    ],
    migrations: [],
    subscribers: [],
});
