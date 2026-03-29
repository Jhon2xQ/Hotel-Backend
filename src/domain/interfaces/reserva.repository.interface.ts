import type { Reserva, EstadoReserva } from "../entities/reserva.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface CreateReservaPersistParams {
  codigo: string;
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  adultos: number;
  ninos: number;
  nombreHuesped: string;
  nroHabitacion: string;
  nombreTipoHab: string;
  nombreCanal: string;
  precioNoche: number;
  IVA: number;
  cargoServicios: number;
  montoTotal: number;
  montoDescuento: number;
  montoFinal: number | null;
}

export interface UpdateReservaParams {
  huespedId?: string;
  habitacionId?: string;
  tarifaId?: string;
  pagoId?: string | null;
  fechaEntrada?: Date;
  fechaSalida?: Date;
  adultos?: number;
  ninos?: number;
  montoDescuento?: number;
  estado?: EstadoReserva;
  motivoCancel?: string | null;
  canceladoEn?: Date | null;
}

export interface ReservaPaginationParams extends PaginationParams {
  tipo?: string;
}

export interface IReservaRepository {
  create(data: CreateReservaPersistParams): Promise<Reserva>;
  findAll(): Promise<Reserva[]>;
  findAllPaginated(params: ReservaPaginationParams): Promise<PaginatedResult<Reserva>>;
  findById(id: string): Promise<Reserva | null>;
  findByCodigo(codigo: string): Promise<Reserva | null>;
  update(id: string, data: UpdateReservaParams): Promise<Reserva | null>;
  delete(id: string): Promise<void>;
  cancel(id: string, motivoCancel: string): Promise<Reserva>;
}
