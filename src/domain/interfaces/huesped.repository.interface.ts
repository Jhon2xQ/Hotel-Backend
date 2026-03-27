import { Huesped, CreateHuespedData } from "../entities/huesped.entity";

export interface UpdateHuespedData {
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
  create(data: CreateHuespedData): Promise<Huesped>;
  findAll(): Promise<Huesped[]>;
  findById(id: string): Promise<Huesped | null>;
  findByEmail(email: string): Promise<Huesped | null>;
  update(id: string, data: UpdateHuespedData): Promise<Huesped>;
  delete(id: string): Promise<void>;
}
