import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Inventories } from "./Inventories";
import { StockMovement } from "./StockMovement";

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @OneToMany(() => Inventories, (inv) => inv.warehouse)
  inventories!: Inventories[];

  @OneToMany(() => StockMovement, (sm) => sm.warehouse)
  stockMovements!: StockMovement[];
}

export default Warehouse;