import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";

export type TipoHabitacionPrismaRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapTipoHabitacionFromPrisma(t: TipoHabitacionPrismaRow): TipoHabitacion {
  return new TipoHabitacion(t.id, t.nombre, t.descripcion, t.createdAt, t.updatedAt);
}
