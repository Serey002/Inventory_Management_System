import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Role } from "../Entities/Roles";

export class RoleRepository extends BaseRepository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } });
  }
}

export default RoleRepository;