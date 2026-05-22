import { Repository, DataSource, FindOptionsWhere, ObjectLiteral } from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral & { id: number }> {
  protected repository: Repository<T>;

  constructor(entity: new () => T, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}