import { Pago, CreatePagoData, ConceptoPago, EstadoPago, MetodoPago } from "../entities/pago.entity";

export interface UpdatePagoData {
  concepto?: ConceptoPago;
  estado?: EstadoPago;
  fechaPago?: Date;
  monto?: number;
  moneda?: string;
  metodo?: MetodoPago;
  recibidoPorId?: string | null;
  notas?: string | null;
}

export interface IPagoRepository {
  create(data: CreatePagoData): Promise<Pago>;
  findAll(): Promise<Pago[]>;
  findById(id: string): Promise<Pago | null>;
  update(id: string, data: UpdatePagoData): Promise<Pago>;
  delete(id: string): Promise<void>;
}
