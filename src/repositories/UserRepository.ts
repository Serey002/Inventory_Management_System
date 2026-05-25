import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { User } from "../Entities/Users";

export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: { role: true },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    return this.repository.existsBy({ email });
  }
}