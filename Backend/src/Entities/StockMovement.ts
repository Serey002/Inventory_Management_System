import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Products } from "./Products";
import { Warehouse } from "./Warehouse";
import { Users } from "./Users";

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Products)
  product!: Products;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  movement_type!: string;

  @Column()
  quantity!: number;

  @ManyToOne(() => Users)
  user!: Users;

  @CreateDateColumn()
  created_at!: Date;
}

export default StockMovement;