import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Users } from "../entities/Users";

export class UserRepository extends BaseRepository<Users> {
  constructor(dataSource: DataSource) {
    super(Users, dataSource);
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.repository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async findActiveUsers(): Promise<Users[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: { role: true },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}

export default UserRepository;