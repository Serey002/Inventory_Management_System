import { DataSource, SelectQueryBuilder } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Supplier } from "../Entities/Supplier";
import {
  SupplierSearchFilters,
  SupplierSearchResult,
} from "../types/supplierType";

interface QueryFilter {
  clause: string;
  parameters: Record<string, unknown>;
}

// ==================== Repository ====================

export class SupplierRepository extends BaseRepository<Supplier> {
  constructor(dataSource: DataSource) {
    super(Supplier, dataSource);
  }

  // ==================== Public Methods ====================

  async findAllSorted(): Promise<Supplier[]> {
    return this.repository.find({
      order: { name: "ASC" }
    });
  }

  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder("supplier")
      .where("LOWER(supplier.email) = LOWER(:email)", { email });

    if (excludeId !== undefined) {
      query.andWhere("supplier.id != :excludeId", { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async search(filters: SupplierSearchFilters): Promise<SupplierSearchResult> {
    const page = Math.max(1, filters.page);
    const limit = Math.max(1, filters.limit);
    const skip = (page - 1) * limit;

    const query = this.buildSearchQuery(filters);
    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  // ==================== Private Methods ====================

  private buildSearchQuery(filters: SupplierSearchFilters): SelectQueryBuilder<Supplier> {
    const query = this.repository
      .createQueryBuilder("supplier")
      .orderBy("supplier.name", "ASC");

    const filtersToApply = [
      this.createGlobalSearchFilter(filters.q),
      this.createLikeFilter("name", filters.name),
      this.createLikeFilter("email", filters.email, { coalesce: true }),
      this.createLikeFilter("phone", filters.phone, { coalesce: true }),
      this.createLikeFilter("contactPerson", filters.contactPerson, { coalesce: true }),
      this.createBooleanFilter("isActive", filters.isActive),
    ];

    for (const filter of filtersToApply) {
      if (filter) {
        query.andWhere(filter.clause, filter.parameters);
      }
    }

    return query;
  }

  private createGlobalSearchFilter(searchTerm?: string): QueryFilter | null {
    const normalizedTerm = this.normalizeString(searchTerm);
    
    if (!normalizedTerm) {
      return null;
    }

    return {
      clause: `
        (
          LOWER(supplier.name) LIKE :search OR
          LOWER(COALESCE(supplier.email, '')) LIKE :search OR
          LOWER(COALESCE(supplier.phone, '')) LIKE :search OR
          LOWER(COALESCE(supplier.contactPerson, '')) LIKE :search
        )
      `,
      parameters: { search: `%${normalizedTerm}%` }
    };
  }

  private createLikeFilter(
    field: string,
    value?: string,
    options: { coalesce?: boolean } = {}
  ): QueryFilter | null {
    const normalizedValue = this.normalizeString(value);
    
    if (!normalizedValue) {
      return null;
    }

    const columnExpression = options.coalesce
      ? `LOWER(COALESCE(supplier.${field}, ''))`
      : `LOWER(supplier.${field})`;

    return {
      clause: `${columnExpression} LIKE :${field}`,
      parameters: { [field]: `%${normalizedValue}%` }
    };
  }

  private createBooleanFilter(field: string, value?: boolean): QueryFilter | null {
    if (value === undefined) {
      return null;
    }

    return {
      clause: `supplier.${field} = :${field}`,
      parameters: { [field]: value }
    };
  }

  private normalizeString(value?: string): string | null {
    if (!value) return null;
    
    const trimmed = value.trim();
    if (!trimmed) return null;
    
    return trimmed.toLowerCase();
  }
}

export default SupplierRepository;
