import type { ConceptoPago, EstadoPago, MetodoPago } from "../../domain/entities/pago.entity";

export interface CreatePagoInput {
  concepto: ConceptoPago;
  estado?: EstadoPago;
  fecha_pago?: Date;
  monto: number;
  moneda?: string;
  metodo: MetodoPago;
  recibido_por_id?: string;
  observacion?: string;
}

export interface UpdatePagoInput {
  concepto?: ConceptoPago;
  estado?: EstadoPago;
  fecha_pago?: Date;
  monto?: number;
  moneda?: string;
  metodo?: MetodoPago;
  observacion?: string;
}

export interface PagoOutput {
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
