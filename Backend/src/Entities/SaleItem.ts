import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Sale } from "./Sale";
import { Products } from "./Products";

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale)
  sale!: Sale;

  @ManyToOne(() => Products)
  product!: Products;

  @Column()
  quantity!: number;

  @Column("decimal")
  price!: number;

  @Column("decimal")
  subtotal!: number;
}

export default SaleItem