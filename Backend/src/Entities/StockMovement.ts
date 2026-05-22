import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";
import { User } from "./User";

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  movement_type!: string;

  @Column()
  quantity!: number;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;
}

export default StockMovement;