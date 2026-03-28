import { CategoriaMueble } from "../../domain/entities/categoria-mueble.entity";

export type CategoriaMueblePrismaRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function mapCategoriaMuebleFromPrisma(data: CategoriaMueblePrismaRow): CategoriaMueble {
  return new CategoriaMueble(
    data.id,
    data.nombre,
    data.descripcion,
    data.activo,
    data.createdAt,
    data.updatedAt,
  );
}
