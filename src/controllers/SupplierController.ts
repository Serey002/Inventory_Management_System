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

  getById = (req: Request, res: Response): Promise<void> =>
    this.withValidId(res, req.params.id, (id) =>
      this.handleRequest(
        res,
        async () => {
          this.sendSuccess(res, await this.supplierService.getById(id));
        },
        "Failed to get supplier",
        404,
      ),
    );

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

  update = (req: Request, res: Response): Promise<void> =>
    this.withValidId(res, req.params.id, (id) =>
      this.handleRequest(
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
      ),
    );

  delete = (req: Request, res: Response): Promise<void> =>
    this.withValidId(res, req.params.id, (id) =>
      this.handleRequest(
        res,
        async () => {
          await this.supplierService.delete(id);
          this.sendSuccess(res, {
            message: "Supplier deactivated successfully",
          });
        },
        "Failed to delete supplier",
        400,
      ),
    );

  private async withValidId(
    res: Response,
    rawId: string | string[] | undefined,
    handler: (id: number) => Promise<void>
  ): Promise<void> {
    const id = this.parseId(rawId);
    
    if (id === null) {
      this.sendError(res, "Invalid supplier ID");
      return;
    }
    
    await handler(id);
  }

  private parseId(rawId: string | string[] | undefined): number | null {
    const value = Array.isArray(rawId) ? rawId[0] : rawId;
    
    if (!value) {
      return null;
    }
    
    const id = parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
  }

  private parseSearchFilters(req: Request): SupplierSearchFilters {
    const { query } = req;
    
    return {
      q: this.getFirstStringValue(query.q),
      name: this.getFirstStringValue(query.name),
      email: this.getFirstStringValue(query.email),
      phone: this.getFirstStringValue(query.phone),
      contactPerson: this.getFirstStringValue(query.contactPerson),
      isActive: this.parseBoolean(query.isActive),
      page: this.parsePositiveInteger(query.page, 1),
      limit: this.parsePositiveInteger(query.limit, 1, 100),
    };
  }

  private getFirstStringValue(value: unknown): string | undefined {
    const raw = Array.isArray(value) ? value[0] : value;
    
    if (typeof raw !== "string") return undefined;
    
    const trimmed = raw.trim();
    return trimmed || undefined;
  }

  private parseBoolean(value: unknown): boolean | undefined {
    const normalized = this.getFirstStringValue(value)?.toLowerCase();
    
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    
    return undefined;
  }

  private parsePositiveInteger(
    value: unknown,
    defaultValue: number,
    maxValue?: number
  ): number {
    const raw = this.getFirstStringValue(value);
    
    if (!raw) {
      return defaultValue;
    }
    
    const parsed = parseInt(raw, 10);
    
    if (Number.isNaN(parsed) || parsed < 1) {
      return defaultValue;
    }

    if (maxValue !== undefined) {
      return Math.min(parsed, maxValue);
    }
    
    return parsed;
  }
}

export default SupplierController;
