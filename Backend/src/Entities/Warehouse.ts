import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Inventory } from "./Inventory";
import { StockMovement } from "./StockMovement";

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @OneToMany(() => Inventory, (inv) => inv.warehouse)
  inventories!: Inventory[];

  @OneToMany(() => StockMovement, (sm) => sm.warehouse)
  stockMovements!: StockMovement[];
}

export default Warehouse;