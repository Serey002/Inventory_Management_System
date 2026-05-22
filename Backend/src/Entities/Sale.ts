import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { SaleItem } from "./SaleItem";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal")
  total_amount!: number;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => SaleItem, (si) => si.sale)
  saleItems!: SaleItem[];
}

export default Sale