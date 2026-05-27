import { ObjectLiteral } from "typeorm";
import { BaseRepository } from "../repositories/BaseRepository";
import { NotFoundError } from "../errors/AppError";

export abstract class AbstractManagementService<
  T extends ObjectLiteral & { id: number },
  CreateDTO,
  UpdateDTO,
> {
  protected constructor(
    protected readonly repository: BaseRepository<T>,
    private readonly entityName: string,
  ) {}

  public async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  public async getById(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    return this.ensureExists(entity);
  }

  public async create(data: CreateDTO): Promise<T> {
    await this.validateCreate(data);
    const entity = this.buildEntity(data);
    return this.repository.save(entity);
  }

  public async update(id: number, data: UpdateDTO): Promise<T> {
    const entity = await this.getById(id);
    await this.validateUpdate(id, data, entity);
    this.applyUpdates(entity, data);
    return this.repository.save(entity);
  }

  public async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }

  protected ensureExists(entity: T | null): T {
    if (!entity) {
      throw new NotFoundError(`${this.entityName} not found`);
    }

    return entity;
  }

  protected async validateCreate(_data: CreateDTO): Promise<void> {}

  protected async validateUpdate(
    _id: number,
    _data: UpdateDTO,
    _entity: T,
  ): Promise<void> {}

  protected applyUpdates(entity: T, data: UpdateDTO): void {
    Object.assign(entity, data);
  }

  protected abstract buildEntity(data: CreateDTO): T;
}

export default AbstractManagementService;
