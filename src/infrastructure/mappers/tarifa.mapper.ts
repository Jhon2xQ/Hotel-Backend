import { Tarifa } from "../../domain/entities/tarifa.entity";
import { mapCanalFromPrisma, type CanalPrismaRow } from "./canal.mapper";
import { mapTipoHabitacionFromPrisma, type TipoHabitacionPrismaRow } from "./tipo-habitacion.mapper";

export type TarifaPrismaRow = {
  id: string;
  precioNoche: unknown;
  IVA: unknown | null;
  cargoServicios: unknown | null;
  moneda: string;
  createdAt: Date;
  updatedAt: Date;
  tipoHabitacion: TipoHabitacionPrismaRow;
  canal: CanalPrismaRow;
};

export function mapTarifaFromPrisma(row: TarifaPrismaRow): Tarifa {
  return new Tarifa(
    row.id,
    mapTipoHabitacionFromPrisma(row.tipoHabitacion),
    mapCanalFromPrisma(row.canal),
    Number(row.precioNoche),
    row.IVA != null ? Number(row.IVA) : null,
    row.cargoServicios != null ? Number(row.cargoServicios) : null,
    row.moneda,
    row.createdAt,
    row.updatedAt,
  );
}
