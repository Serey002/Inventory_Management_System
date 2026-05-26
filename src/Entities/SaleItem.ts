import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from "typeorm";
import { Sale } from "./Sale";
import { Product } from "./Products";

@Entity("sale_items")
export class SaleItem {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "saleId" })
  sale!: Sale;

  @Column()
  saleId!: number;

  @ManyToOne(() => Product, (p) => p.saleItems, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;
}

export default SaleItem;