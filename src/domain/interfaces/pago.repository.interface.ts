import type { Pago, ConceptoPago, EstadoPago, MetodoPago } from "../entities/pago.entity";

export interface CreatePagoParams {
  concepto: ConceptoPago;
  estado?: EstadoPago;
  fechaPago?: Date;
  monto: number;
  moneda?: string;
  metodo: MetodoPago;
  recibidoPorId?: string | null;
  observacion?: string | null;
  reservaId?: string;
  folioId?: string;
}

export interface UpdatePagoParams {
  concepto?: ConceptoPago;
  estado?: EstadoPago;
  fechaPago?: Date;
  monto?: number;
  moneda?: string;
  metodo?: MetodoPago;
  observacion?: string | null;
}

export interface IPagoRepository {
  create(data: CreatePagoParams): Promise<Pago>;
  findAll(): Promise<Pago[]>;
  findById(id: string): Promise<Pago | null>;
  findByReservaId(reservaId: string): Promise<Pago | null>;
  findByFolioId(folioId: string): Promise<Pago | null>;
  update(id: string, data: UpdatePagoParams): Promise<Pago>;
  delete(id: string): Promise<void>;
}
