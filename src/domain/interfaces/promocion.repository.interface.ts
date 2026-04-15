import type { Promocion } from "../entities/promocion.entity";

export interface CreatePromocionParams {
  codigo: string;
  tipoDescuento: string;
  valorDescuento: number;
  vigDesde: Date;
  vigHasta: Date;
  estado?: boolean;
  habitaciones?: string[];
}

export interface UpdatePromocionParams {
  codigo?: string;
  tipoDescuento?: string;
  valorDescuento?: number;
  vigDesde?: Date;
  vigHasta?: Date;
  estado?: boolean;
  habitaciones?: string[];
}

export interface PromocionWithHabitaciones {
  id: string;
  codigo: string;
  tipoDescuento: string;
  valorDescuento: number;
  vigDesde: Date;
  vigHasta: Date;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
  habitaciones: string[];
}

export interface IPromocionRepository {
  create(data: CreatePromocionParams): Promise<PromocionWithHabitaciones>;
  findAll(): Promise<PromocionWithHabitaciones[]>;
  findById(id: string): Promise<PromocionWithHabitaciones | null>;
  findByCodigo(codigo: string): Promise<Promocion | null>;
  findByCodigos(codigos: string[]): Promise<Promocion[]>;
  findByIds(ids: string[]): Promise<Promocion[]>;
  update(id: string, data: UpdatePromocionParams): Promise<PromocionWithHabitaciones>;
  delete(id: string): Promise<void>;
}
