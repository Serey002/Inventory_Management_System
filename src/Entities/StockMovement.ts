import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from "typeorm";
import { Product } from "./Products";
import { Warehouse } from "./Warehouse";
import { Supplier } from "./Supplier";
import { Users } from "./Users";

export enum MovementType {
  IN         = "IN",
  OUT        = "OUT",
  TRANSFER   = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
}

@Entity("stock_movements")
export class StockMovement {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ type: "enum", enum: MovementType })
  type!: MovementType;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "text", nullable: true })
  note!: string | null;

  // ── Source ────────────────────────────────────────────────────────────────

  @ManyToOne(() => Product, (p) => p.stockMovements, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: number;

  @ManyToOne(() => Warehouse, (w) => w.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "warehouseId" })
  warehouse!: Warehouse | null;

  @Column({ nullable: true })
  warehouseId!: number | null;

  // ── Transfer destination ──────────────────────────────────────────────────

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "destinationWarehouseId" })
  destinationWarehouse!: Warehouse | null;

  @Column({ nullable: true })
  destinationWarehouseId!: number | null;

  // ── Relations ─────────────────────────────────────────────────────────────

  @ManyToOne(() => Supplier, (s) => s.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "supplierId" })
  supplier!: Supplier | null;

  @Column({ nullable: true })
  supplierId!: number | null;

  @ManyToOne(() => Users, (u) => u.stockMovements, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: Users | null;

  @Column({ nullable: true })
  userId!: number | null;

  @CreateDateColumn()
  readonly createdAt!: Date;
}

export default StockMovement;
