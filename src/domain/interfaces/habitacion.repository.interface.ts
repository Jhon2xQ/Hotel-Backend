import type { Habitacion } from "../entities/habitacion.entity";

export interface CreateHabitacionParams {
  nroHabitacion: string;
  tipoHabitacionId: string;
  piso: number;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  urlImagen?: string[] | null;
  estado?: boolean;
  descripcion?: string | null;
}

export interface UpdateHabitacionParams {
  nroHabitacion?: string;
  tipoHabitacionId?: string;
  piso?: number;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  urlImagen?: string[] | null;
  estado?: boolean;
  descripcion?: string | null;
}

export interface UpdateHabitacionStatusParams {
  estado?: boolean;
}

export interface IHabitacionRepository {
  create(data: CreateHabitacionParams): Promise<Habitacion>;
  findAll(): Promise<Habitacion[]>;
  findById(id: string): Promise<Habitacion | null>;
  findByNumero(numero: string): Promise<Habitacion | null>;
  update(id: string, data: UpdateHabitacionParams): Promise<Habitacion>;
  updateStatus(id: string, data: UpdateHabitacionStatusParams): Promise<Habitacion>;
  delete(id: string): Promise<void>;
  hasRelatedRecords(id: string): Promise<boolean>;
  findAllWithDirectPrice(): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findByTipoWithDirectPrice(tipoNombre: string): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findAvailableInDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    tipoNombre?: string,
  ): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findByIdWithDirectPrice(id: string): Promise<{ habitacion: Habitacion; precioNoche: number | null } | null>;
}
