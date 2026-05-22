import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Roles } from "../entities/Roles";


export class RoleRepository extends BaseRepository<Roles> {
  constructor(dataSource: DataSource) {
    super(Roles, dataSource);
  }

  async findByName(name: string): Promise<Roles | null> {
    return this.repository.findOne({ where: { name } });
  }
}

export default RoleRepository;