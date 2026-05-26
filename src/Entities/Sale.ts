import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from "typeorm";
import { User } from "./Users";
import { SaleItem } from "./SaleItem";

export enum SaleStatus {
  PENDING   = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED  = "REFUNDED",
}

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  invoiceNumber!: string;

  @Column({ type: "enum", enum: SaleStatus, default: SaleStatus.PENDING })
  status!: SaleStatus;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  grandTotal!: number;

  @Column({ type: "text", nullable: true })
  note!: string | null;

  @ManyToOne(() => User, (u) => u.sales, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: User | null;

  @Column({ nullable: true })
  userId!: number | null;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items!: SaleItem[];

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}

export default Sale;