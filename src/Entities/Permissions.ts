import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Role } from "./Roles";

@Entity("permissions")
export class Permission extends BaseEntity {
  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description!: string | null;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}

export default Permission;
