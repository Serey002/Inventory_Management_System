import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm";
import { Products } from "./Products";
import { StockMovement } from "./StockMovement";

@Entity("suppliers")
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  contactPerson!: string;

  @Column({ type: "varchar", length: 150, nullable: true, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Products, (product) => product.supplier)
  products!: Products[];

  @OneToMany(() => StockMovement, (sm) => sm.supplier)
  stockMovements!: StockMovement[];
}

export default Supplier;