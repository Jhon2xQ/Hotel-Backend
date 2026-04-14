import type { Habitacion } from "../entities/habitacion.entity";
import type { EstadoReserva } from "../entities/reserva.entity";
import type { Mueble } from "../entities/mueble.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface HabitacionConPromociones extends Habitacion {
  promociones: string[];
}

export interface HabitacionPaginationParams extends PaginationParams {
  tipo?: string;
}

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
  findAllPaginated(params: HabitacionPaginationParams): Promise<PaginatedResult<HabitacionConPromociones>>;
  findById(id: string): Promise<Habitacion | null>;
  findByIdWithMuebles(id: string): Promise<{ habitacion: Habitacion; muebles: Mueble[] } | null>;
  findByIdWithReservas(
    id: string,
    estadosReserva: EstadoReserva[],
  ): Promise<{ habitacion: Habitacion; reservas: Array<{ fechaInicio: Date; fechaFin: Date; estado: EstadoReserva }> } | null>;
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
  findByIdWithDirectPriceAndMuebles(id: string): Promise<{ habitacion: Habitacion; muebles: Mueble[]; precioNoche: number | null } | null>;
  findByIdWithReservasAndMuebles(
    id: string,
    estadosReserva: EstadoReserva[],
  ): Promise<{ habitacion: HabitacionConPromociones; muebles: Mueble[]; reservas: Array<{ fechaInicio: Date; fechaFin: Date; estado: EstadoReserva }> } | null>;
}
