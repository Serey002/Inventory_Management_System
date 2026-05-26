import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Categories } from "../Entities/Categories";

export class CategoryRepository extends BaseRepository<Categories> {
  constructor(dataSource: DataSource) {
    super(Categories, dataSource);
  }

  async findByName(name: string): Promise<Categories | null> {
    return this.repository.findOne({
      where: { name },
    });
  }
}

export default CategoryRepository;
