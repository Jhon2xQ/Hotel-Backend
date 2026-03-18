import { Huesped, CreateHuespedData } from "../entities/huesped.entity";

export interface UpdateHuespedData {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  nacionalidad?: string;
  nivelVip?: number;
  notas?: string | null;
}

export interface IHuespedRepository {
  create(data: CreateHuespedData): Promise<Huesped>;
  findAll(): Promise<Huesped[]>;
  findById(id: string): Promise<Huesped | null>;
  update(id: string, data: UpdateHuespedData): Promise<Huesped>;
  delete(id: string): Promise<void>;
}
