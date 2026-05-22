import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  company_name!: string;

  @Column()
  phone!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @OneToMany(() => Product, (product) => product.supplier)
  products!: Product[];
}

export default Supplier;