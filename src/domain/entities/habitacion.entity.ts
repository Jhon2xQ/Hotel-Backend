import type { TipoHabitacion } from "./tipo-habitacion.entity";

export class Habitacion {
  constructor(
    public readonly id: string,
    public readonly nroHabitacion: string,
    public readonly tipoHabitacion: TipoHabitacion,
    public readonly piso: number,
    public readonly feature: string | null,
    public readonly amenities: string | null,
    public readonly urlImagen: string[] | null,
    public readonly estado: boolean,
    public readonly descripcion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
