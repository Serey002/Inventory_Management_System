import {
  Entity, Column,
  ManyToOne, JoinColumn, OneToMany,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Role } from "./Roles";
import { Sale } from "./Sale";
import { StockMovement } from "./StockMovement";

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, select: false })
  password!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt!: Date | null;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: "SET NULL",
    eager: true,
  })
  @JoinColumn({ name: "roleId" })
  role!: Role | null;

  @Column({ nullable: true })
  roleId!: number | null;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];

  @OneToMany(() => StockMovement, (sm) => sm.user)
  stockMovements!: StockMovement[];
}

export default User;