import type { TipoHabitacion } from "./tipo-habitacion.entity";
import type { Canal } from "./canal.entity";

export class Tarifa {
  constructor(
    public readonly id: string,
    public readonly tipoHabitacion: TipoHabitacion,
    public readonly canal: Canal,
    public readonly precioNoche: number,
    public readonly IVA: number | null,
    public readonly cargoServicios: number | null,
    public readonly moneda: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
