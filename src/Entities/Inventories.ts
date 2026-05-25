import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from "typeorm";
import { Product } from "./Products";
import { Warehouse } from "./Warehouse";

@Entity("inventories")
@Unique(["productId", "warehouseId"])
export class Inventory {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @ManyToOne(() => Product, (p) => p.inventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: number;

  @ManyToOne(() => Warehouse, (w) => w.inventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "warehouseId" })
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @Column({ type: "int", default: 0 })
  quantity!: number;

  @Column({ type: "int", default: 0 })
  reservedQuantity!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}