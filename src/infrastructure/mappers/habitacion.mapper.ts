import { Habitacion, EstadoHabitacion } from "../../domain/entities/habitacion.entity";

export type HabitacionPrismaRow = {
  id: string;
  nroHabitacion: string;
  tipoHabitacionId: string;
  piso: number;
  tieneDucha: boolean;
  tieneBanio: boolean;
  urlImagen: string[] | null;
  estado: string;
  notas: string | null;
  ultimaLimpieza: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tipo: { id: string; nombre: string; descripcion: string | null } | null;
};

export function mapHabitacionFromPrisma(data: HabitacionPrismaRow): Habitacion {
  const tipo = data.tipo
    ? { id: data.tipo.id, nombre: data.tipo.nombre, descripcion: data.tipo.descripcion }
    : null;

  return new Habitacion(
    data.id,
    data.nroHabitacion,
    data.tipoHabitacionId,
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
