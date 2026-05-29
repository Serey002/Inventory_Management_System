import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { WarehouseService } from "../services/WarehouseService";

export class WarehouseController extends BaseController {
  constructor(private readonly warehouseService: WarehouseService) {
    super();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.warehouseService.getAll());
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to fetch warehouses"));
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.warehouseService.getById(Number(req.params.id)));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to fetch warehouse"), 404);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, location, phone } = req.body;
    if (!name) {
      this.sendError(res, "Name is required");
      return;
    }
    try {
      this.sendCreated(res, await this.warehouseService.create({ name, location, phone }));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to create warehouse"), 400);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.warehouseService.update(Number(req.params.id), req.body));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to update warehouse"), 400);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.warehouseService.delete(Number(req.params.id));
      this.sendSuccess(res, { message: "Warehouse deleted" });
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to delete warehouse"), 404);
    }
  };
}

export default WarehouseController;