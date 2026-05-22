import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Sale } from "./Sale";
import { Product } from "./Product";

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale)
  sale!: Sale;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  quantity!: number;

  @Column("decimal")
  price!: number;

  @Column("decimal")
  subtotal!: number;
}

export default SaleItem