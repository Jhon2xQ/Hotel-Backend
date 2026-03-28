import type { Tarifa } from "../../domain/entities/tarifa.entity";
import type { TipoHabitacionDto } from "./tipo-habitacion.dto";
import type { CanalDto } from "./canal.dto";
import { toTipoHabitacionDto } from "./tipo-habitacion.dto";
import { toCanalDto } from "./canal.dto";

export interface CreateTarifaDto {
  tipo_habitacion_id: string;
  canal_id: string;
  precio_noche: number;
  iva?: number | null;
  cargo_servicios?: number | null;
  moneda?: string;
}

export interface UpdateTarifaDto {
  tipo_habitacion_id?: string;
  canal_id?: string;
  precio_noche?: number;
  iva?: number | null;
  cargo_servicios?: number | null;
  moneda?: string;
}

export interface TarifaDto {
  id: string;
  tipo_habitacion: TipoHabitacionDto;
  canal: CanalDto;
  precio_noche: number;
  iva: number | null;
  cargo_servicios: number | null;
  moneda: string;
  created_at: string;
  updated_at: string;
}

export function toTarifaDto(t: Tarifa): TarifaDto {
  return {
    id: t.id,
    tipo_habitacion: toTipoHabitacionDto(t.tipoHabitacion),
    canal: toCanalDto(t.canal),
    precio_noche: t.precioNoche,
    iva: t.IVA,
    cargo_servicios: t.cargoServicios,
    moneda: t.moneda,
    created_at: t.createdAt.toISOString(),
    updated_at: t.updatedAt.toISOString(),
  };
}
