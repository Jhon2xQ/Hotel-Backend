import { TipoHabitacion } from "./tipo-habitacion.entity";
import { Canal } from "./canal.entity";

export interface CreateTarifaData {
  tipoHabitacionId: string;
  canalId: string;
  precioNoche: number;
  IVA?: number | null;
  cargoServicios?: number | null;
  moneda?: string;
}

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

  toOutput() {
    return {
      id: this.id,
      tipo_habitacion: this.tipoHabitacion.toOutput(),
      canal: this.canal.toOutput(),
      precio_noche: this.precioNoche,
      iva: this.IVA,
      cargo_servicios: this.cargoServicios,
      moneda: this.moneda,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
