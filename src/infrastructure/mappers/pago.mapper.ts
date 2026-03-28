import { Pago, ConceptoPago, EstadoPago, MetodoPago } from "../../domain/entities/pago.entity";

export type PagoPrismaRow = {
  id: string;
  concepto: string;
  estado: string;
  fechaPago: Date;
  monto: unknown;
  moneda: string;
  metodo: string;
  recibidoPorId: string | null;
  observacion: string | null;
  createdAt: Date;
  recibidoPor?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export function mapPagoFromPrisma(p: PagoPrismaRow): Pago {
  return new Pago(
    p.id,
    p.concepto as ConceptoPago,
    p.estado as EstadoPago,
    p.fechaPago,
    Number(p.monto),
    p.moneda,
    p.metodo as MetodoPago,
    p.recibidoPorId,
    p.recibidoPor
      ? { id: p.recibidoPor.id, name: p.recibidoPor.name, email: p.recibidoPor.email }
      : null,
    p.observacion,
    p.createdAt,
  );
}
