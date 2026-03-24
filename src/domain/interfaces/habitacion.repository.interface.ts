import { Habitacion, CreateHabitacionData, EstadoHabitacion } from "../entities/habitacion.entity";

export interface UpdateHabitacionData {
  nroHabitacion?: string;
  tipoHabitacionId?: string;
  piso?: number;
  tieneDucha?: boolean;
  tieneBanio?: boolean;
  urlImagen?: string[] | null;
  estado?: EstadoHabitacion;
  notas?: string | null;
  ultiLimpieza?: Date | null;
}

export interface UpdateHabitacionStatusData {
  estado?: EstadoHabitacion;
  ultiLimpieza?: Date | null;
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
  findAllWithDirectPrice(): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findByTipoWithDirectPrice(tipoNombre: string): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findAvailableInDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    tipoNombre?: string,
  ): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>>;
  findByIdWithDirectPrice(id: string): Promise<{ habitacion: Habitacion; precioNoche: number | null } | null>;
}
