import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Roles } from "./Roles";
import { Sale } from "./Sale";
import { StockMovement } from "./StockMovement";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Roles, (roles) => roles.users)
  role!: Roles;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];

  @OneToMany(() => StockMovement, (sm) => sm.user)
  stockMovements!: StockMovement[];
}

export default Users;