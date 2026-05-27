import { Supplier } from "../Entities/Supplier";

export interface SupplierProfileInput {
  name?: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}

export interface CreateSupplierInput extends SupplierProfileInput {
  name: string;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export interface SupplierSearchFilters {
  q?: string;
  name?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  isActive?: boolean;
  page: number;
  limit: number;
}

export interface SupplierSearchResult {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
}
