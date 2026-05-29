import { Warehouse } from "../Entities/Warehouse";

export type CreateWarehouseDTO = Pick<Warehouse, "name"> & {
  location?: string | null;
  phone?: string | null;
};

export type UpdateWarehouseDTO = Partial<Pick<Warehouse, "name" | "location" | "phone" | "isActive">>;

export type SafeWarehouse = Pick<Warehouse, "id" | "name" | "location" | "phone" | "isActive">;