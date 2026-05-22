import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique
} from "typeorm";
import { Products } from "./Products";
import { Warehouse } from "./Warehouse";

@Entity("inventories")
@Unique(["productId", "warehouseId"])
export class Inventories {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Products, (product) => product.inventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Products;

  @Column()
  productId!: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "warehouseId" })
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @Column({ type: "int", default: 0 })
  quantity!: number;

  @Column({ type: "int", default: 0 })
  reservedQuantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Inventories;