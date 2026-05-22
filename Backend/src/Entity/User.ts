import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Role } from "./Role";
import { Sale } from "./Sale";
import { StockMovement } from "./StockMovement";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];

  @OneToMany(() => StockMovement, (sm) => sm.user)
  stockMovements!: StockMovement[];
}

export default User;