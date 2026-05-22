import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { Warehouse } from "./Warehouse";

@Entity()
export class Inventories {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Products)
  product!: Products;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({ default: 0 })
  quantity!: number;
}

export default Inventories;