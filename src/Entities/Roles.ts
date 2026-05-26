import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./Users";

/**
 * Represents a permission role (e.g. ADMIN, STAFF).
 * Inherits id, createdAt, updatedAt from BaseEntity.
 */
@Entity("roles")
export class Role extends BaseEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}

export default Role;