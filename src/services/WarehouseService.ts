import { AbstractManagementService } from "./AbstractManagementService";
import { WarehouseRepository } from "../repositories/WarehouseRepository";
import { Warehouse } from "../Entities/Warehouse";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "../types/warehouseType";

export class WarehouseService extends AbstractManagementService<
  Warehouse,
  CreateWarehouseDTO,
  UpdateWarehouseDTO
> {
  constructor(warehouseRepository: WarehouseRepository) {
    super(warehouseRepository, "Warehouse");
  }

  protected buildEntity(data: CreateWarehouseDTO): Warehouse {
    return Object.assign(new Warehouse(), {
      name: data.name,
      location: data.location ?? null,
      phone: data.phone ?? null,
      isActive: true,
    });
  }
}

export default WarehouseService;
