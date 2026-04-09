import type { TipoHabitacion } from "./tipo-habitacion.entity";

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipoHabitacion: TipoHabitacion,
    public readonly piso: number,
    public readonly tieneDucha: boolean,
    public readonly tieneBanio: boolean,
    public readonly urlImagen: string[] | null,
    public readonly estado: boolean,
    public readonly descripcion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
