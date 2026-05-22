import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({ default: 0 })
  quantity!: number;
}

export default Inventory;