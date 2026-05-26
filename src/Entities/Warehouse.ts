import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Inventory } from "./Inventories";
import { StockMovement } from "./StockMovement";

@Entity("warehouses")
export class Warehouse extends BaseEntity {
  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  location!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Inventory, (inv) => inv.warehouse)
  inventories!: Inventory[];

  @OneToMany(() => StockMovement, (sm) => sm.warehouse)
  stockMovements!: StockMovement[];
}

export default Warehouse;