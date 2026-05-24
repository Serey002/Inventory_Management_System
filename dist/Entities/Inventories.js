"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventories = void 0;
const typeorm_1 = require("typeorm");
const Products_1 = require("./Products");
const Warehouse_1 = require("./Warehouse");
let Inventories = class Inventories {
};
exports.Inventories = Inventories;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventories.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Products_1.Products, (product) => product.inventories, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "productId" }),
    __metadata("design:type", Products_1.Products)
], Inventories.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Inventories.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse, (warehouse) => warehouse.inventories, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "warehouseId" }),
    __metadata("design:type", Warehouse_1.Warehouse)
], Inventories.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Inventories.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Inventories.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Inventories.prototype, "reservedQuantity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inventories.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Inventories.prototype, "updatedAt", void 0);
exports.Inventories = Inventories = __decorate([
    (0, typeorm_1.Entity)("inventories"),
    (0, typeorm_1.Unique)(["productId", "warehouseId"])
], Inventories);
exports.default = Inventories;
