import type { Reserva, EstadoReserva } from "../entities/reserva.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface CreateReservaPersistParams {
  codigo: string;
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaInicio: Date;
  fechaFin: Date;
  adultos: number;
  ninos: number;
  nombreHuesped: string;
  nroHabitacion: string;
  nombreTipoHab: string;
  nombreCanal: string;
  precioNoche: number;
  cantidadNoches: number;
  IVA: number;
  cargoServicios: number;
  montoTotal: number;
}

export interface UpdateReservaParams {
  huespedId?: string;
  habitacionId?: string;
  tarifaId?: string;
  pagoId?: string | null;
  fechaInicio?: Date;
  fechaFin?: Date;
  adultos?: number;
  ninos?: number;
  estado?: EstadoReserva;
  motivoCancel?: string | null;
  canceladoEn?: Date | null;
}

export interface IReservaRepository {
  create(data: CreateReservaPersistParams): Promise<Reserva>;
  findAll(): Promise<Reserva[]>;
  findAllPaginated(params: ReservaPaginationParams): Promise<PaginatedResult<Reserva>>;
  findById(id: string): Promise<Reserva | null>;
  findByCodigo(codigo: string): Promise<Reserva | null>;
  findConflictingReservations(
    habitacionId: string,
    fechaInicio: Date,
    fechaFin: Date,
    excludeReservaId?: string,
  ): Promise<Reserva[]>;
  update(id: string, data: UpdateReservaParams): Promise<Reserva | null>;
  delete(id: string): Promise<void>;
  cancel(id: string, motivoCancel: string): Promise<Reserva>;
}

export interface ReservaPaginationParams extends PaginationParams {
  nombre?: string;
  tipo?: string;
}
