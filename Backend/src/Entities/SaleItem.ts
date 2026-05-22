import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from "typeorm";
import { Sale } from "./Sale";
import { Products } from "./Products";

@Entity("sale_items")
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "saleId" })
  sale!: Sale;

  @Column()
  saleId!: number;

  @ManyToOne(() => Products, (product) => product.saleItems, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "productId" })
  product!: Products;

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
  createdAt!: Date;
}