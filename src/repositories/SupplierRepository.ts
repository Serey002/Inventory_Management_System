import { DataSource, SelectQueryBuilder } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Supplier } from "../Entities/Supplier";
import { SupplierSearchFilters, SupplierSearchResult } from "../types/supplierType";

export class SupplierRepository extends BaseRepository<Supplier> {
  constructor(dataSource: DataSource) {
    super(Supplier, dataSource);
  }

  // Get all suppliers sorted by name
  async findAllSorted(): Promise<Supplier[]> {
    return this.repository.find({ order: { name: "ASC" } });
  }

  // Check if a supplier with the given email exists
  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder("supplier")
      .where("LOWER(supplier.email) = LOWER(:email)", { email });
    if (excludeId !== undefined) {
      query.andWhere("supplier.id != :excludeId", { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  // Search suppliers with optional filters and pagination
  async search(filters: SupplierSearchFilters): Promise<SupplierSearchResult> {
    const page  = Math.max(1, filters.page);
    const limit = Math.max(1, filters.limit);
    const [data, total] = await this.buildSearchQuery(filters)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total, page, limit };
  }

  // Build the search query based on provided filters
  private buildSearchQuery(filters: SupplierSearchFilters): SelectQueryBuilder<Supplier> {
    const query = this.repository
      .createQueryBuilder("supplier")
      .orderBy("supplier.name", "ASC");
    const { q, name, email, phone, contactPerson, isActive } = filters;
    if (q) {
      const term = `%${q.trim().toLowerCase()}%`;
      query.andWhere(`(
        LOWER(supplier.name) LIKE :q OR
        LOWER(COALESCE(supplier.email, '')) LIKE :q OR
        LOWER(COALESCE(supplier.phone, '')) LIKE :q OR
        LOWER(COALESCE(supplier.contactPerson, '')) LIKE :q
      )`, { q: term });
    }
    
    const likeFilters: Array<[string, string | undefined, boolean?]> = [
      ["name",          name],
      ["email",         email,         true],
      ["phone",         phone,         true],
      ["contactPerson", contactPerson, true],
    ];

    for (const [field, value, coalesce] of likeFilters) {
      if (!value) continue;
      const term = `%${value.trim().toLowerCase()}%`; 
      const col  = coalesce
        ? `LOWER(COALESCE(supplier.${field}, ''))`
        : `LOWER(supplier.${field})`;
      query.andWhere(`${col} LIKE :${field}`, { [field]: term });
    }
    if (isActive !== undefined) {
      query.andWhere("supplier.isActive = :isActive", { isActive });
    }
    return query;
  }
}

export default SupplierRepository;