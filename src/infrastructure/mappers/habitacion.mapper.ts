import { Habitacion } from "../../domain/entities/habitacion.entity";
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
};

export function mapHabitacionFromPrisma(data: HabitacionPrismaRow): Habitacion {
  const tipoHabitacion = mapTipoHabitacionFromPrisma({
    id: data.tipo.id,
    nombre: data.tipo.nombre,
    createdAt: data.tipo.createdAt,
    updatedAt: data.tipo.updatedAt,
  });

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
  );
}
