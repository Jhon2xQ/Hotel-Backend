import { Huesped } from "../../domain/entities/huesped.entity";

export type HuespedPrismaRow = {
  id: string;
  tipoDoc: string | null;
  nroDoc: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapHuespedFromPrisma(h: HuespedPrismaRow): Huesped {
  return new Huesped(
    h.id,
    h.tipoDoc,
    h.nroDoc,
    h.nombres,
    h.apellidos,
    h.email,
    h.telefono,
    h.nacionalidad,
    h.observacion,
    h.createdAt,
    h.updatedAt,
  );
}
