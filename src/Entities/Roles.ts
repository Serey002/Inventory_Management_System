import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Users } from "./Users";
import { Permission } from "./Permissions";

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

  @OneToMany(() => Users, (user) => user.role)
  users!: Users[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "roleId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permissionId",
      referencedColumnName: "id",
    },
  })
  permissions!: Permission[];
}

export default Role;
