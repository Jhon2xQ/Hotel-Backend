import { Habitacion, EstadoHabitacion } from "../../domain/entities/habitacion.entity";
import { mapTipoHabitacionFromPrisma, type TipoHabitacionPrismaRow } from "./tipo-habitacion.mapper";

export type HabitacionPrismaRow = {
  id: string;
  nroHabitacion: string;
  piso: number;
  tieneDucha: boolean;
  tieneBanio: boolean;
  urlImagen: string[] | null;
  estado: string;
  notas: string | null;
  ultimaLimpieza: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tipo: (TipoHabitacionPrismaRow & Record<string, unknown>) | null;
};

export function mapHabitacionFromPrisma(data: HabitacionPrismaRow): Habitacion {
  const tipo = data.tipo
    ? mapTipoHabitacionFromPrisma({
        id: data.tipo.id,
        nombre: data.tipo.nombre,
        descripcion: data.tipo.descripcion,
        createdAt: data.tipo.createdAt,
        updatedAt: data.tipo.updatedAt,
      })
    : null;

  return new Habitacion(
    data.id,
    data.nroHabitacion,
    tipo,
    data.piso,
    data.tieneDucha,
    data.tieneBanio,
    data.urlImagen,
    data.estado as EstadoHabitacion,
    data.notas,
    data.ultimaLimpieza,
    data.createdAt,
    data.updatedAt,
  );
}
