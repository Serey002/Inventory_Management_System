import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Supplier } from "./Supplier";
import { Inventory } from "./Inventory";
import { StockMovement } from "./StockMovement";
import { SaleItem } from "./SaleItem";

@Entity()
export class Product {
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

  @ManyToOne(() => Category, (cat) => cat.products)
  category!: Category;

  @ManyToOne(() => Supplier, (sup) => sup.products)
  supplier!: Supplier;

  @OneToMany(() => Inventory, (inv) => inv.product)
  inventories!: Inventory[];

  @OneToMany(() => StockMovement, (sm) => sm.product)
  stockMovements!: StockMovement[];

  @OneToMany(() => SaleItem, (si) => si.product)
  saleItems!: SaleItem[];
}

export default Product;