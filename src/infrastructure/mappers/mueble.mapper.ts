import { Mueble, MuebleCondition } from "../../domain/entities/mueble.entity";

export type MueblePrismaRow = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoriaId: string;
  imagenUrl: string | null;
  condicion: string;
  fechaAdq: Date | null;
  ultimaRevision: Date | null;
  habitacionId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapMuebleFromPrisma(data: MueblePrismaRow): Mueble {
  return new Mueble(
    data.id,
    data.codigo,
    data.nombre,
    data.descripcion,
    data.categoriaId,
    data.imagenUrl,
    data.condicion as MuebleCondition,
    data.fechaAdq,
    data.ultimaRevision,
    data.habitacionId,
    data.createdAt,
    data.updatedAt,
  );
}
