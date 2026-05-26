import { Repository, DataSource, FindOptionsWhere, ObjectLiteral } from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral & { id: number }> {
  protected readonly repository: Repository<T>;

  protected constructor(entity: new () => T, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  public async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  public async findById(id: number): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  public async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  public async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public async existsById(id: number): Promise<boolean> {
    return this.repository.existsBy({ id } as FindOptionsWhere<T>);
  }
}

export default BaseRepository;
