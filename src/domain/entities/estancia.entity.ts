import type { Habitacion } from "./habitacion.entity";
import type { Huesped } from "./huesped.entity";

export enum EstadoEstadia {
  EN_CASA = "EN_CASA",
  COMPLETADA = "COMPLETADA",
  SALIDA_ANTICIPADA = "SALIDA_ANTICIPADA",
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
    return this.estado === EstadoEstadia.COMPLETADA;
  }

  isEnCasa(): boolean {
    return this.estado === EstadoEstadia.EN_CASA;
  }
}
