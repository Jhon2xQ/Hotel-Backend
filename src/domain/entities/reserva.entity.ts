import { Huesped } from "./huesped.entity";
import { Habitacion } from "./habitacion.entity";
import { Tarifa } from "./tarifa.entity";
import { Pago } from "./pago.entity";

export type EstadoReserva = "TENTATIVA" | "CONFIRMADA" | "EN_CASA" | "COMPLETADA" | "CANCELADA" | "NO_LLEGO";

export interface CreateReservaData {
  codigo: string;
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  adultos: number;
  ninos: number;
  montoDescuento?: number;
}

export class Reserva {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly huesped: Huesped,
    public readonly habitacion: Habitacion,
    public readonly tarifa: Tarifa,
    public readonly pago: Pago | null,
    public readonly fechaEntrada: Date,
    public readonly fechaSalida: Date,
    public readonly adultos: number,
    public readonly ninos: number,
    // Snapshot (desnormalización)
    public readonly nombreHuesped: string,
    public readonly nroHabitacion: string,
    public readonly nombreTipoHab: string,
    public readonly nombreCanal: string,
    // Precios
    public readonly precioNoche: number,
    public readonly IVA: number,
    public readonly cargoServicios: number,
    // Totales
    public readonly montoTotal: number,
    public readonly montoDescuento: number,
    public readonly montoFinal: number | null,
    // Estado
    public readonly estado: EstadoReserva,
    public readonly motivoCancel: string | null,
    public readonly canceladoEn: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompletada(): boolean {
    return this.estado === "COMPLETADA";
  }

  canBeModified(): boolean {
    return this.estado !== "COMPLETADA";
  }

  toOutput() {
    return {
      id: this.id,
      codigo: this.codigo,
      huesped: this.huesped.toOutput(),
      habitacion: {
        id: this.habitacion.id,
        nro_habitacion: this.habitacion.nroHabitacion,
        piso: this.habitacion.piso,
        estado: this.habitacion.estado,
      },
      tarifa: this.tarifa.toOutput(),
      pago: this.pago?.toOutput() || null,
      fecha_entrada: this.fechaEntrada.toISOString(),
      fecha_salida: this.fechaSalida.toISOString(),
      adultos: this.adultos,
      ninos: this.ninos,
      // Snapshot
      nombre_huesped: this.nombreHuesped,
      nro_habitacion: this.nroHabitacion,
      nombre_tipo_hab: this.nombreTipoHab,
      nombre_canal: this.nombreCanal,
      // Precios
      precio_noche: this.precioNoche,
      iva: this.IVA,
      cargo_servicios: this.cargoServicios,
      // Totales
      monto_total: this.montoTotal,
      monto_descuento: this.montoDescuento,
      monto_final: this.montoFinal,
      // Estado
      estado: this.estado,
      motivo_cancel: this.motivoCancel,
      cancelado_en: this.canceladoEn?.toISOString() || null,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
