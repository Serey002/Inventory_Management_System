import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm";
import { Inventories } from "./Inventories";
import { StockMovement } from "./StockMovement";

@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  location!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Inventories, (inventory) => inventory.warehouse)
  inventories!: Inventories[];

  @OneToMany(() => StockMovement, (sm) => sm.warehouse)
  stockMovements!: StockMovement[];
}
export default Warehouse;