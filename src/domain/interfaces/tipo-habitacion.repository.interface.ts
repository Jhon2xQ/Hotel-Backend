import type { TipoHabitacion } from "../entities/tipo-habitacion.entity";

export interface CreateTipoHabitacionParams {
  nombre: string;
  descripcion?: string | null;
}

export interface UpdateTipoHabitacionParams {
  nombre?: string;
  descripcion?: string | null;
}

export interface ITipoHabitacionRepository {
  create(data: CreateTipoHabitacionParams): Promise<TipoHabitacion>;
  findAll(): Promise<TipoHabitacion[]>;
  findById(id: string): Promise<TipoHabitacion | null>;
  update(id: string, data: UpdateTipoHabitacionParams): Promise<TipoHabitacion>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findByName(nombre: string): Promise<TipoHabitacion | null>;
}
