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
    public readonly recibidoPor: { id: string; name: string; email: string } | null,
    public readonly observacion: string | null,
    public readonly createdAt: Date,
  ) {}
}
