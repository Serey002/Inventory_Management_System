import { ProductRepository } from "../repositories/ProductRepository";
import { Products } from "../Entities/Products";

export interface ProductDTO {
  name: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  quantity?: number;
  status?: string;
  categoryId?: number;
  supplierId?: number;
}

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAll(): Promise<Products[]> {
    return this.productRepository.findAllWithRelations();
  }

  async getById(id: number): Promise<Products> {
    const product = await this.productRepository.findByIdWithRelations(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async create(data: ProductDTO): Promise<Products> {
    const product = Object.assign(new Products(), data);
    return this.productRepository.save(product);
  }

  async update(id: number, data: Partial<ProductDTO>): Promise<Products> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    await this.productRepository.delete(id);
  }
}

export default ProductService;
