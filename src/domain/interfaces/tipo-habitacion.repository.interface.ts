import type { TipoHabitacion } from "../entities/tipo-habitacion.entity";
import type { Habitacion } from "../entities/habitacion.entity";

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
  findAllWithSampleHabitacion(): Promise<Array<{ tipoHabitacion: TipoHabitacion; habitacion: Habitacion | null }>>;
  findById(id: string): Promise<TipoHabitacion | null>;
  update(id: string, data: UpdateTipoHabitacionParams): Promise<TipoHabitacion>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findByName(nombre: string): Promise<TipoHabitacion | null>;
}
