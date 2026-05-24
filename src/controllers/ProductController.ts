import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ProductService, ProductDTO } from "../services/ProductService";

export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.productService.getAll());
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to get products"), 500);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid product ID");
      return;
    }
    try {
      this.sendSuccess(res, await this.productService.getById(id));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to get product"), 404);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, sku, barcode, price, cost } = req.body as ProductDTO;
    if (!name || !sku || !barcode || price == null || cost == null) {
      this.sendError(res, "name, sku, barcode, price and cost are required");
      return;
    }
    try {
      this.sendCreated(res, await this.productService.create(req.body as ProductDTO));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to create product"), 500);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid product ID");
      return;
    }
    try {
      this.sendSuccess(res, await this.productService.update(id, req.body as Partial<ProductDTO>));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to update product"), 404);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid product ID");
      return;
    }
    try {
      await this.productService.delete(id);
      this.sendSuccess(res, { message: "Product deleted successfully" });
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to delete product"), 404);
    }
  };
}

export default ProductController;
