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
exports.Products = void 0;
const typeorm_1 = require("typeorm");
const Categories_1 = require("./Categories");
const Supplier_1 = require("./Supplier");
const Inventories_1 = require("./Inventories");
const StockMovement_1 = require("./StockMovement");
const SaleItem_1 = require("./SaleItem");
let Products = class Products {
};
exports.Products = Products;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Products.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Products.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Products.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Products.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Products.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Products.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "ACTIVE" }),
    __metadata("design:type", String)
], Products.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Categories_1.Categories, (cat) => cat.products),
    __metadata("design:type", Categories_1.Categories)
], Products.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Supplier_1.Supplier, (sup) => sup.products),
    __metadata("design:type", Supplier_1.Supplier)
], Products.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Inventories_1.Inventories, (inv) => inv.product),
    __metadata("design:type", Array)
], Products.prototype, "inventories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockMovement_1.StockMovement, (sm) => sm.product),
    __metadata("design:type", Array)
], Products.prototype, "stockMovements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleItem_1.SaleItem, (si) => si.product),
    __metadata("design:type", Array)
], Products.prototype, "saleItems", void 0);
exports.Products = Products = __decorate([
    (0, typeorm_1.Entity)()
], Products);
exports.default = Products;
