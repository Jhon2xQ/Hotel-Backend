import type { ConceptoPago, EstadoPago, MetodoPago, Pago } from "../../domain/entities/pago.entity";

export interface CreatePagoDto {
  concepto: ConceptoPago;
  estado?: EstadoPago;
  fecha_pago?: Date;
  monto: number;
  moneda?: string;
  metodo: MetodoPago;
  recibido_por_id?: string;
  observacion?: string;
  reservaId?: string;
  folioId?: string;
}

export interface UpdatePagoDto {
  concepto?: ConceptoPago;
  estado?: EstadoPago;
  fecha_pago?: Date;
  monto?: number;
  moneda?: string;
  metodo?: MetodoPago;
  observacion?: string;
}

export interface PagoDto {
  id: string;
  concepto: string;
  estado: string;
  fecha_pago: string;
  monto: string;
  moneda: string;
  metodo: string;
  recibido_por_id: string | null;
  recibido_por: {
    id: string;
    name: string;
    email: string;
  } | null;
  observacion: string | null;
  created_at: string;
}

export function toPagoDto(p: Pago): PagoDto {
  return {
    id: p.id,
    concepto: p.concepto,
    estado: p.estado,
    fecha_pago: p.fechaPago.toISOString(),
    monto: p.monto.toString(),
    moneda: p.moneda,
    metodo: p.metodo,
    recibido_por_id: p.recibidoPorId,
    recibido_por: p.recibidoPor,
    observacion: p.observacion,
    created_at: p.createdAt.toISOString(),
  };
}
