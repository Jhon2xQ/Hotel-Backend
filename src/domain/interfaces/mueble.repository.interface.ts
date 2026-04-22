import type { PaginationParams } from "../../application/paginations/api.pagination";
import type { PaginatedResult } from "../../application/paginations/api.pagination";
import { Mueble, MuebleCondition } from "../entities/mueble.entity";

export interface MueblePaginationParams extends PaginationParams {
  codigo?: string;
  categoria?: string;
  condicion?: MuebleCondition;
}

export interface CreateMuebleParams {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoriaId: string;
  urlImagen?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  habitacionId?: string | null;
}

export interface UpdateMuebleParams {
  codigo?: string;
  nombre?: string;
  categoriaId?: string;
  urlImagen?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  descripcion?: string | null;
  habitacionId?: string | null;
}

export interface IMuebleRepository {
  create(data: CreateMuebleParams): Promise<Mueble>;
  findAll(): Promise<Mueble[]>;
  findAllPaginated(params: MueblePaginationParams): Promise<PaginatedResult<Mueble>>;
  findById(id: string): Promise<Mueble | null>;
  findByCodigo(codigo: string): Promise<Mueble | null>;
  update(id: string, data: UpdateMuebleParams): Promise<Mueble>;
  delete(id: string): Promise<void>;
}
