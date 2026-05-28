import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Warehouse } from "../Entities/Warehouse";

export class WarehouseRepository extends BaseRepository<Warehouse> {
  constructor(dataSource: DataSource) {
    super(Warehouse, dataSource);
  }
}

export default WarehouseRepository;