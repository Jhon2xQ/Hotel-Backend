import { Mueble, MuebleCondition } from "../../domain/entities/mueble.entity";
import { mapCategoriaMuebleFromPrisma, type CategoriaMueblePrismaRow } from "./categoria-mueble.mapper";

export type MueblePrismaRow = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  urlImagen: string | null;
  condicion: string;
  fechaAdq: Date | null;
  ultimaRevision: Date | null;
  habitacionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoria: CategoriaMueblePrismaRow & Record<string, unknown>;
};

export function mapMuebleFromPrisma(data: MueblePrismaRow): Mueble {
  const categoria = mapCategoriaMuebleFromPrisma({
    id: data.categoria.id,
    nombre: data.categoria.nombre,
    descripcion: data.categoria.descripcion,
    activo: data.categoria.activo,
    createdAt: data.categoria.createdAt,
    updatedAt: data.categoria.updatedAt,
  });

  return new Mueble(
    data.id,
    data.codigo,
    data.nombre,
    data.descripcion,
    categoria,
    data.urlImagen,
    data.condicion as MuebleCondition,
    data.fechaAdq,
    data.ultimaRevision,
    data.habitacionId,
    data.createdAt,
    data.updatedAt,
  );
}
