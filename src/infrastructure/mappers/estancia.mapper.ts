import { Estancia, EstadoEstadia } from "../../domain/entities/estancia.entity";
import { mapHabitacionFromPrisma, type HabitacionPrismaRow } from "./habitacion.mapper";
import { mapHuespedFromPrisma, type HuespedPrismaRow } from "./huesped.mapper";

export type EstanciaPrismaRow = {
  id: string;
  reservaId: string;
  fechaEntrada: Date;
  fechaSalida: Date | null;
  estado: string;
  notas: string | null;
  createdAt: Date;
  updatedAt: Date;
  habitacion: HabitacionPrismaRow;
  huesped: HuespedPrismaRow;
};

export function mapEstanciaFromPrisma(data: EstanciaPrismaRow): Estancia {
  return new Estancia(
    data.id,
    data.reservaId,
    mapHabitacionFromPrisma(data.habitacion),
    mapHuespedFromPrisma(data.huesped),
    data.fechaEntrada,
    data.fechaSalida,
    data.estado as EstadoEstadia,
    data.notas,
    data.createdAt,
    data.updatedAt,
  );
}
