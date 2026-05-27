import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { SupplierDTO, SupplierService } from "../services/SupplierService";
import {
  SupplierSearchFilters,
  UpdateSupplierInput,
} from "../types/supplierType";

export class SupplierController extends BaseController {
  constructor(private readonly supplierService: SupplierService) {
    super();
  }

  getAll = (_req: Request, res: Response): Promise<void> =>
    this.handleRequest(
      res,
      async () => {
        this.sendSuccess(res, await this.supplierService.getAll());
      },
      "Failed to get suppliers",
      500,
    );

  search = (req: Request, res: Response): Promise<void> =>
    this.handleRequest(
      res,
      async () => {
        this.sendSuccess(
          res,
          await this.supplierService.search(this.parseSearchFilters(req)),
        );
      },
      "Failed to search suppliers",
      500,
    );

  getById = (req: Request, res: Response): Promise<void> => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      this.sendError(res, "Invalid supplier ID");
      return Promise.resolve();
    }
    return this.handleRequest(
      res,
      async () => {
        this.sendSuccess(res, await this.supplierService.getById(id));
      },
      "Failed to get supplier",
      404,
    );
  };

  create = (req: Request, res: Response): Promise<void> => {
    const input = req.body as SupplierDTO;

    if (!input.name?.trim()) {
      this.sendError(res, "Supplier name is required");
      return Promise.resolve();
    }

    return this.handleRequest(
      res,
      async () => {
        this.sendCreated(res, await this.supplierService.create(input));
      },
      "Failed to create supplier",
      400,
    );
  };

  update = (req: Request, res: Response): Promise<void> => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      this.sendError(res, "Invalid supplier ID");
      return Promise.resolve();
    }
    return this.handleRequest(
      res,
      async () => {
        this.sendSuccess(
          res,
          await this.supplierService.update(
            id,
            req.body as UpdateSupplierInput,
          ),
        );
      },
      "Failed to update supplier",
      400,
    );
  };

  delete = (req: Request, res: Response): Promise<void> => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      this.sendError(res, "Invalid supplier ID");
      return Promise.resolve();
    }
    return this.handleRequest(
      res,
      async () => {
        await this.supplierService.delete(id);
        this.sendSuccess(res, { message: "Supplier deactivated successfully" });
      },
      "Failed to delete supplier",
      400,
    );
  };

  private parseSearchFilters(req: Request): SupplierSearchFilters {
    const { query } = req;

    return {
      q: this.parseQueryString(query.q),
      name: this.parseQueryString(query.name),
      email: this.parseQueryString(query.email),
      phone: this.parseQueryString(query.phone),
      contactPerson: this.parseQueryString(query.contactPerson),
      isActive: this.parseQueryBoolean(query.isActive),
      page: this.parseQueryPositiveInt(query.page, 1),
      limit: this.parseQueryPositiveInt(query.limit, 1, 100),
    };
  }
}

export default SupplierController;
