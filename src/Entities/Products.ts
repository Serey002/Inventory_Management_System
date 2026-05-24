import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Categories } from "./Categories";
import { Supplier } from "./Supplier";
import { Inventories } from "./Inventories";
import { StockMovement } from "./StockMovement";
import { SaleItem } from "./SaleItem";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  sku!: string;

  @Column({ unique: true })
  barcode!: string;

  @Column("decimal")
  price!: number;

  @Column("decimal")
  cost!: number;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: "ACTIVE" })
  status!: string;

  @ManyToOne(() => Categories, (cat) => cat.products)
  category!: Categories;

  @ManyToOne(() => Supplier, (sup) => sup.products)
  supplier!: Supplier;

  @OneToMany(() => Inventories, (inv) => inv.product)
  inventories!: Inventories[];

  @OneToMany(() => StockMovement, (sm) => sm.product)
  stockMovements!: StockMovement[];

  @OneToMany(() => SaleItem, (si) => si.product)
  saleItems!: SaleItem[];
}

export default Products;