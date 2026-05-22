import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from "typeorm";
import { Products } from "./Products";
import { Warehouse } from "./Warehouse";
import { Supplier } from "./Supplier";
import { Users } from "./Users";

export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
}

@Entity("stock_movements")
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: MovementType })
  type!: MovementType;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "text", nullable: true })
  note!: string;

  @ManyToOne(() => Products, (product) => product.stockMovements, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Products;

  @Column()
  productId!: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "warehouseId" })
  warehouse!: Warehouse;

  @Column({ nullable: true })
  warehouseId!: number;

  // For TRANSFER: destination warehouse
  @ManyToOne(() => Warehouse, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "destinationWarehouseId" })
  destinationWarehouse!: Warehouse;

  @Column({ nullable: true })
  destinationWarehouseId!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "supplierId" })
  supplier!: Supplier;

  @Column({ nullable: true })
  supplierId!: number;

  @ManyToOne(() => Users, (user) => user.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: Users;

  @Column({ nullable: true })
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}