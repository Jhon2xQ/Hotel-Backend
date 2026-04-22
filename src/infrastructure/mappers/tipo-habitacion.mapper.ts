import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";

export type TipoHabitacionPrismaRow = {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapTipoHabitacionFromPrisma(t: TipoHabitacionPrismaRow): TipoHabitacion {
  return new TipoHabitacion(t.id, t.nombre, t.createdAt, t.updatedAt);
}
