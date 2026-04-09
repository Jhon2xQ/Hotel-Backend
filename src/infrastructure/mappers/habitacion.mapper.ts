import { Habitacion } from "../../domain/entities/habitacion.entity";
import { mapMuebleFromPrisma, type MueblePrismaRow } from "./mueble.mapper";
import { mapTipoHabitacionFromPrisma, type TipoHabitacionPrismaRow } from "./tipo-habitacion.mapper";

export type HabitacionPrismaRow = {
  id: string;
  nroHabitacion: string;
  piso: number;
  tieneDucha: boolean;
  tieneBanio: boolean;
  urlImagen: string[] | null;
  estado: boolean;
  descripcion: string | null;
  createdAt: Date;
  updatedAt: Date;
  tipo: TipoHabitacionPrismaRow & Record<string, unknown>;
  muebles?: MueblePrismaRow[];
};

export function mapHabitacionFromPrisma(data: HabitacionPrismaRow): Habitacion {
  const tipoHabitacion = mapTipoHabitacionFromPrisma({
    id: data.tipo.id,
    nombre: data.tipo.nombre,
    descripcion: data.tipo.descripcion,
    createdAt: data.tipo.createdAt,
    updatedAt: data.tipo.updatedAt,
  });

  const muebles = data.muebles?.map(mapMuebleFromPrisma) ?? [];

  return new Habitacion(
    data.id,
    data.nroHabitacion,
    tipoHabitacion,
    data.piso,
    data.tieneDucha,
    data.tieneBanio,
    data.urlImagen,
    data.estado,
    data.descripcion,
    data.createdAt,
    data.updatedAt,
    muebles,
  );
}
