import { TipoHabitacionOutput } from "./tipo-habitacion.dto";
import { CanalOutput } from "./canal.dto";

export interface CreateTarifaInput {
  tipo_habitacion_id: string;
  canal_id: string;
  precio_noche: number;
  iva?: number;
  cargo_servicios?: number;
  moneda?: string;
}

export interface UpdateTarifaInput {
  tipo_habitacion_id?: string;
  canal_id?: string;
  precio_noche?: number;
  iva?: number;
  cargo_servicios?: number;
  moneda?: string;
}

export interface TarifaOutput {
  id: string;
  tipo_habitacion: TipoHabitacionOutput;
  canal: CanalOutput;
  precio_noche: number;
  iva: number | null;
  cargo_servicios: number | null;
  moneda: string;
  created_at: string;
  updated_at: string;
}
