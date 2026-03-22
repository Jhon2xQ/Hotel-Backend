export enum ConceptoPago {
  RESERVA = "RESERVA",
  CONSUMO = "CONSUMO",
}

export enum EstadoPago {
  CONFIRMADO = "CONFIRMADO",
  DEVUELTO = "DEVUELTO",
  RETENIDO = "RETENIDO",
  ANULADO = "ANULADO",
}

export enum MetodoPago {
  EFECTIVO = "EFECTIVO",
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  TRANSFERENCIA = "TRANSFERENCIA",
}

export interface PersonalBasic {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
}

export interface CreatePagoData {
  concepto: ConceptoPago;
  estado?: EstadoPago;
  fechaPago?: Date;
  monto: number;
  moneda?: string;
  metodo: MetodoPago;
  recibidoPorId?: string | null;
  observacion?: string | null;
}

export class Pago {
  constructor(
    public readonly id: string,
    public readonly concepto: ConceptoPago,
    public readonly estado: EstadoPago,
    public readonly fechaPago: Date,
    public readonly monto: number,
    public readonly moneda: string,
    public readonly metodo: MetodoPago,
    public readonly recibidoPorId: string | null,
    public readonly recibidoPor: PersonalBasic | null,
    public readonly observacion: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: CreatePagoData): Pago {
    return new Pago(
      crypto.randomUUID(),
      data.concepto,
      data.estado ?? EstadoPago.CONFIRMADO,
      data.fechaPago ?? new Date(),
      data.monto,
      data.moneda ?? "SOL",
      data.metodo,
      data.recibidoPorId ?? null,
      null,
      data.observacion ?? null,
      new Date(),
    );
  }

  toOutput() {
    return {
      id: this.id,
      concepto: this.concepto,
      estado: this.estado,
      fecha_pago: this.fechaPago.toISOString(),
      monto: this.monto.toString(),
      moneda: this.moneda,
      metodo: this.metodo,
      recibido_por_id: this.recibidoPorId,
      recibido_por: this.recibidoPor
        ? {
            id: this.recibidoPor.id,
            codigo: this.recibidoPor.codigo,
            nombres: this.recibidoPor.nombres,
            apellidos: this.recibidoPor.apellidos,
          }
        : null,
      observacion: this.observacion,
      created_at: this.createdAt.toISOString(),
    };
  }
}
