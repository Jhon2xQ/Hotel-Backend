import { Habitacion, CreateHabitacionData, EstadoHabitacion, EstadoLimpieza } from "../entities/habitacion.entity";
import type { CatalogoMueble } from "../entities/tipo-habitacion.entity";

export interface UpdateHabitacionData {
  nroHabitacion?: string;
  tipoId?: string;
  piso?: number;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  urlImagen?: string | null;
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
  notas?: string | null;
  muebles?: CatalogoMueble[];
}

export interface UpdateHabitacionStatusData {
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
}

export interface IHabitacionRepository {
  create(data: CreateHabitacionData): Promise<Habitacion>;
  findAll(): Promise<Habitacion[]>;
  findById(id: string): Promise<Habitacion | null>;
  findByNumero(numero: string): Promise<Habitacion | null>;
  update(id: string, data: UpdateHabitacionData): Promise<Habitacion>;
  updateStatus(id: string, data: UpdateHabitacionStatusData): Promise<Habitacion>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
}
