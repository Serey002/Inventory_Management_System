import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Products } from "../Entities/Products";

export class ProductRepository extends BaseRepository<Products> {
  constructor(dataSource: DataSource) {
    super(Products, dataSource);
  }

  async findAllWithRelations(): Promise<Products[]> {
    return this.repository.find({
      relations: { category: true, supplier: true },
    });
  }

  async findByIdWithRelations(id: number): Promise<Products | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true, supplier: true },
    });
  }

  
}

export default ProductRepository;
