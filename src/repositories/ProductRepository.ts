import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Product } from "../Entities/Products";

export class ProductRepository extends BaseRepository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource);
  }

  async findAllWithRelations(): Promise<Product[]> {
    return this.repository.find({
      relations: { category: true, supplier: true },
    });
  }

  async findByIdWithRelations(id: number): Promise<Product | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true, supplier: true },
    });
  }

  
}

export default ProductRepository;
