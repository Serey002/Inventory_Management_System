import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./Products";
import { StockMovement } from "./StockMovement";

@Entity("suppliers")
export class Supplier extends BaseEntity {
  @Column({ type: "varchar", length: 150 })
  public name!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  public contactPerson!: string | null;

  @Column({ type: "varchar", length: 150, nullable: true, unique: true })
  public email!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  public phone!: string | null;

  @Column({ type: "text", nullable: true })
  public address!: string | null;

  @Column({ type: "boolean", default: true })
  public isActive!: boolean;

  @OneToMany(() => Product, (product) => product.supplier)
  public products!: Product[];

  @OneToMany(() => StockMovement, (sm) => sm.supplier)
  public stockMovements!: StockMovement[];
}

export default Supplier;
