import { TipoHabitacion, CreateTipoHabitacionData, CatalogoMueble } from "../entities/tipo-habitacion.entity";

export interface UpdateTipoHabitacionData {
  nombre?: string;
  descripcion?: string | null;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  muebles?: CatalogoMueble[];
}

export interface ITipoHabitacionRepository {
  create(data: CreateTipoHabitacionData): Promise<TipoHabitacion>;
  findAll(): Promise<TipoHabitacion[]>;
  findById(id: string): Promise<TipoHabitacion | null>;
  update(id: string, data: UpdateTipoHabitacionData): Promise<TipoHabitacion>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
}
