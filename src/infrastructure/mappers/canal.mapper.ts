import { Canal, type CanalTipo } from "../../domain/entities/canal.entity";

export type CanalPrismaRow = {
  id: string;
  nombre: string;
  tipo: string;
  activo: boolean;
  notas: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapCanalFromPrisma(c: CanalPrismaRow): Canal {
  return new Canal(
    c.id,
    c.nombre,
    c.tipo as CanalTipo,
    c.activo,
    c.notas,
    c.createdAt,
    c.updatedAt,
  );
}
