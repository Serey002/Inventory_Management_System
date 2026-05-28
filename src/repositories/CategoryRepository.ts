import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Category } from "../Entities/Categories";

export class CategoryRepository extends BaseRepository<Category> {
  constructor(dataSource: DataSource) {
    super(Category, dataSource);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { name },
    });
  }
}

export default CategoryRepository;
