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

export type UpdateProductInput = Partial<ProductDTO>;
