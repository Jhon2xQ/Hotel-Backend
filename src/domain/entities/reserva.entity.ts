export enum EstadoReserva {
  TENTATIVA = "TENTATIVA",
  CONFIRMADA = "CONFIRMADA",
  EN_CASA = "EN_CASA",
  COMPLETADA = "COMPLETADA",
  CANCELADA = "CANCELADA",
  NO_LLEGO = "NO_LLEGO",
}

export class Reserva {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly huespedId: string,
    public readonly habitacionId: string,
    public readonly tarifaId: string,
    public readonly pagoId: string | null,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly adultos: number,
    public readonly ninos: number,
    public readonly nombreHuesped: string,
    public readonly nroHabitacion: string,
    public readonly nombreTipoHab: string,
    public readonly nombreCanal: string,
    public readonly precioTarifa: number,
    public readonly unidadTarifa: string,
    public readonly cantidadUnidad: number,
    public readonly IVA: number,
    public readonly cargoServicios: number,
    public readonly montoTotal: number,
    public readonly estado: EstadoReserva,
    public readonly motivoCancel: string | null,
    public readonly canceladoEn: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompletada(): boolean {
    return this.estado === EstadoReserva.COMPLETADA;
  }

  canBeModified(): boolean {
    return this.estado !== EstadoReserva.COMPLETADA;
  }
}
