import type { TipoHabitacion } from "./tipo-habitacion.entity";

export enum EstadoHabitacion {
  DISPONIBLE = "DISPONIBLE",
  RESERVADA = "RESERVADA",
  OCUPADA = "OCUPADA",
  LIMPIEZA = "LIMPIEZA",
  MANTENIMIENTO = "MANTENIMIENTO",
}

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipo: TipoHabitacion | null,
    public readonly piso: number,
    public readonly tieneDucha: boolean,
    public readonly tieneBanio: boolean,
    public readonly urlImagen: string[] | null,
    public readonly estado: EstadoHabitacion,
    public readonly notas: string | null,
    public readonly ultiLimpieza: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
