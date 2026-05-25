import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./Products";
import { StockMovement } from "./StockMovement";

@Entity("suppliers")
export class Supplier extends BaseEntity {
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

  @OneToMany(() => Product, (product) => product.supplier)
  products!: Product[];

  @OneToMany(() => StockMovement, (sm) => sm.supplier)
  stockMovements!: StockMovement[];
}

export default Supplier;