import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from "typeorm";
import { Roles } from "./Roles";
import { Sale } from "./Sale";
import { StockMovement } from "./StockMovement";

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt!: Date;

  @ManyToOne(() => Roles, (role) => role.users, { nullable: true, onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "roleId" })
  role!: Roles;

  @Column({ nullable: true })
  roleId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales!: Sale[];

  @OneToMany(() => StockMovement, (sm) => sm.user)
  stockMovements!: StockMovement[];
}

export default Users;