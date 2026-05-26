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

// ==================== Types ====================

export type SupplierDTO = CreateSupplierInput;

// ==================== Service ====================

export class SupplierService extends AbstractManagementService<
  Supplier,
  SupplierDTO,
  UpdateSupplierInput
> {
  constructor(private readonly supplierRepository: SupplierRepository) {
    super(supplierRepository, "Supplier");
  }

  // ==================== Public Methods ====================

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

  // ==================== Protected Override Methods ====================

  protected buildEntity(data: SupplierDTO): Supplier {
    const supplier = new Supplier();
    const enrichedData = {
      ...data,
      isActive: data.isActive ?? true,
    };
    
    return this.applySupplierProfile(supplier, enrichedData);
  }

  protected override applyUpdates(entity: Supplier, data: UpdateSupplierInput): void {
    this.applySupplierProfile(entity, data);
  }

  protected override async validateCreate(data: SupplierDTO): Promise<void> {
    await this.ensureEmailIsUnique(data.email);
  }

  protected override async validateUpdate(
    id: number,
    data: UpdateSupplierInput,
    existingEntity: Supplier,
  ): Promise<void> {
    if (data.email === undefined) {
      return;
    }

    const normalizedEmail = this.normalizeOptionalEmail(data.email);
    const emailHasChanged = normalizedEmail !== existingEntity.email;

    if (emailHasChanged) {
      await this.ensureEmailIsUnique(normalizedEmail, id);
    }
  }

  // ==================== Private Helper Methods ====================

  private async ensureEmailIsUnique(
    email?: string | null,
    excludeId?: number,
  ): Promise<void> {
    const normalizedEmail = this.normalizeOptionalEmail(email);
    
    if (!normalizedEmail) {
      return;
    }

    const emailExists = await this.supplierRepository.emailExists(
      normalizedEmail,
      excludeId,
    );

    if (emailExists) {
      throw new ConflictError("Supplier email already exists");
    }
  }

  private applySupplierProfile(
    supplier: Supplier,
    data: SupplierProfileInput,
  ): Supplier {
    if (data.name !== undefined) {
      supplier.name = this.validateAndNormalizeRequiredText(data.name, "Supplier name");
    }

    if (data.contactPerson !== undefined) {
      supplier.contactPerson = this.normalizeOptionalText(data.contactPerson);
    }

    if (data.email !== undefined) {
      supplier.email = this.normalizeOptionalEmail(data.email);
    }

    if (data.phone !== undefined) {
      supplier.phone = this.normalizeOptionalText(data.phone);
    }

    if (data.address !== undefined) {
      supplier.address = this.normalizeOptionalText(data.address);
    }

    if (data.isActive !== undefined) {
      supplier.isActive = data.isActive;
    }

    return supplier;
  }

  private validateAndNormalizeRequiredText(value: string, fieldName: string): string {
    const trimmed = value.trim();
    
    if (!trimmed) {
      throw new ValidationError(`${fieldName} is required`);
    }
    
    return trimmed;
  }

  private normalizeOptionalText(value?: string | null): string | null {
    const trimmed = value?.trim();
    return trimmed || null;
  }

  private normalizeOptionalEmail(value?: string | null): string | null {
    const normalized = this.normalizeOptionalText(value);
    return normalized ? normalized.toLowerCase() : null;
  }
}

export default SupplierService;
