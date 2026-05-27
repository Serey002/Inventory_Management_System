import { ConflictError, ValidationError } from "../errors/AppError";
import { Supplier } from "../Entities/Supplier";
import { SupplierRepository } from "../repositories/SupplierRepository";
import { AbstractManagementService } from "./AbstractManagementService";
import {
  CreateSupplierInput,
  SupplierProfileInput,
  SupplierSearchFilters,
  SupplierSearchResult,
  UpdateSupplierInput,
} from "../types/supplierType";

export type SupplierDTO = CreateSupplierInput;

export class SupplierService extends AbstractManagementService<
  Supplier,
  SupplierDTO,
  UpdateSupplierInput
> {
  constructor(private readonly supplierRepository: SupplierRepository) {
    super(supplierRepository, "Supplier");
  }

  override async getAll(): Promise<Supplier[]> {
    return this.supplierRepository.findAllSorted();
  }

  async search(filters: SupplierSearchFilters): Promise<SupplierSearchResult> {
    return this.supplierRepository.search(filters);
  }

  override async delete(id: number): Promise<void> {
    const supplier = await this.getById(id);
    supplier.isActive = false;
    await this.supplierRepository.save(supplier);
  }

  protected buildEntity(data: SupplierDTO): Supplier {
    return this.applyProfile(new Supplier(), { isActive: true, ...data });
  }

  protected override applyUpdates(entity: Supplier, data: UpdateSupplierInput): void {
    this.applyProfile(entity, data);
  }

  protected override async validateCreate(data: SupplierDTO): Promise<void> {
    await this.assertEmailUnique(data.email);
  }

  protected override async validateUpdate(
    id: number,
    data: UpdateSupplierInput,
    existing: Supplier
  ): Promise<void> {
    if (data.email === undefined) return;

    const normalized = this.normalizeEmail(data.email);
    if (normalized !== existing.email) {
      await this.assertEmailUnique(normalized, id);
    }
  }

  private async assertEmailUnique(email?: string | null, excludeId?: number): Promise<void> {
    const normalized = this.normalizeEmail(email);
    if (!normalized) return;

    const exists = await this.supplierRepository.emailExists(normalized, excludeId);
    if (exists) throw new ConflictError("Supplier email already exists");
  }

  private applyProfile(supplier: Supplier, data: SupplierProfileInput): Supplier {
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) throw new ValidationError("Supplier name is required");
      supplier.name = name;
    }

    if (data.contactPerson !== undefined) supplier.contactPerson = data.contactPerson?.trim() || null;
    if (data.email !== undefined)         supplier.email = this.normalizeEmail(data.email);
    if (data.phone !== undefined)         supplier.phone = data.phone?.trim() || null;
    if (data.address !== undefined)       supplier.address = data.address?.trim() || null;
    if (data.isActive !== undefined)      supplier.isActive = data.isActive;

    return supplier;
  }

  private normalizeEmail(value?: string | null): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed.toLowerCase() : null;
  }
}

export default SupplierService;