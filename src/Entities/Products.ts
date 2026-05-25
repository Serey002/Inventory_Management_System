import {
  Entity, Column,
  ManyToOne, OneToMany, JoinColumn,
  CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Categories";
import { Supplier } from "./Supplier";
import { Inventory } from "./Inventories";
import { StockMovement } from "./StockMovement";
import { SaleItem } from "./SaleItem";

export enum ProductStatus {
  ACTIVE   = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ unique: true })
  sku!: string;

  @Column({ unique: true })
  barcode!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  cost!: number;

  @Column({ type: "int", default: 0 })
  quantity!: number;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ManyToOne(() => Category, (cat) => cat.products, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "categoryId" })
  category!: Category | null;

  @Column({ nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => Supplier, (sup) => sup.products, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "supplierId" })
  supplier!: Supplier | null;

  @Column({ nullable: true })
  supplierId!: number | null;

  @OneToMany(() => Inventory, (inv) => inv.product)
  inventories!: Inventory[];

  @OneToMany(() => StockMovement, (sm) => sm.product)
  stockMovements!: StockMovement[];

  @OneToMany(() => SaleItem, (si) => si.product)
  saleItems!: SaleItem[];

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}

export default Product;