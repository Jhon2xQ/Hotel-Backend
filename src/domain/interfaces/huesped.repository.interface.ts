import type { Huesped } from "../entities/huesped.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface CreateHuespedParams {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE" | null;
  nro_doc?: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion?: string | null;
}

export interface UpdateHuespedParams {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE" | null;
  nro_doc?: string | null;
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  nacionalidad?: string;
  observacion?: string | null;
}

export interface IHuespedRepository {
  create(data: CreateHuespedParams): Promise<Huesped>;
  findAll(): Promise<Huesped[]>;
  findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Huesped>>;
  findById(id: string): Promise<Huesped | null>;
  findByEmail(email: string): Promise<Huesped | null>;
  update(id: string, data: UpdateHuespedParams): Promise<Huesped>;
  delete(id: string): Promise<void>;
}
