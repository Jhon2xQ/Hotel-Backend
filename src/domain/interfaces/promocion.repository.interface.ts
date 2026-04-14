import type { Promocion } from "../entities/promocion.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface PromocionPaginationParams extends PaginationParams {}

export interface CreatePromocionParams {
  codigo: string;
  tipoDescuento: string;
  valorDescuento: number;
  vigDesde: Date;
  vigHasta: Date;
  estado?: boolean;
  habitacionIds?: string[];
}

export interface UpdatePromocionParams {
  codigo?: string;
  tipoDescuento?: string;
  valorDescuento?: number;
  vigDesde?: Date;
  vigHasta?: Date;
  estado?: boolean;
  habitacionIds?: string[];
}

export interface IPromocionRepository {
  create(data: CreatePromocionParams): Promise<Promocion>;
  findAll(params: PromocionPaginationParams): Promise<PaginatedResult<Promocion>>;
  findById(id: string): Promise<Promocion | null>;
  findByCodigo(codigo: string): Promise<Promocion | null>;
  update(id: string, data: UpdatePromocionParams): Promise<Promocion>;
  delete(id: string): Promise<void>;
}
