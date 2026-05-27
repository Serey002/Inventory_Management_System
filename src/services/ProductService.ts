import { ProductRepository } from "../repositories/ProductRepository";
import { Product } from "../Entities/Products";
import { AbstractManagementService } from "./AbstractManagementService";
import { ProductDTO, UpdateProductInput } from "../types/productType";

export class ProductService extends AbstractManagementService<
  Product,
  ProductDTO,
  UpdateProductInput
> {
  constructor(private readonly productRepository: ProductRepository) {
    super(productRepository, "Product");
  }

  public override async getAll(): Promise<Product[]> {
    return this.productRepository.findAllWithRelations();
  }

  public override async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findByIdWithRelations(id);
    return this.ensureExists(product);
  }

  protected buildEntity(data: ProductDTO): Product {
    return Object.assign(new Product(), data);
  }
}

export default ProductService;
