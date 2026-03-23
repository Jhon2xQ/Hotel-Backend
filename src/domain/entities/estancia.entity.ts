import { Habitacion } from "./habitacion.entity";
import { Huesped } from "./huesped.entity";

export type EstadoEstadia = "EN_CASA" | "COMPLETADA" | "SALIDA_ANTICIPADA";

export interface CreateEstanciaData {
  reservaId: string;
  habitacionId: string;
  huespedId: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export class Estancia {
  constructor(
    public readonly id: string,
    public readonly reservaId: string,
    public readonly habitacion: Habitacion,
    public readonly huesped: Huesped,
    public readonly fechaEntrada: Date,
    public readonly fechaSalida: Date | null,
    public readonly estado: EstadoEstadia,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompletada(): boolean {
    return this.estado === "COMPLETADA";
  }

  isEnCasa(): boolean {
    return this.estado === "EN_CASA";
  }

  toOutput() {
    return {
      id: this.id,
      reserva_id: this.reservaId,
      habitacion: this.habitacion.toOutput(),
      huesped: this.huesped.toOutput(),
      fecha_entrada: this.fechaEntrada.toISOString(),
      fecha_salida: this.fechaSalida?.toISOString() || null,
      estado: this.estado,
      notas: this.notas,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
