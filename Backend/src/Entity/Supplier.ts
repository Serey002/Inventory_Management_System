import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Products } from "./Products";

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

  @OneToMany(() => Products, (product) => product.supplier)
  products!: Products[];
}

export default Supplier;