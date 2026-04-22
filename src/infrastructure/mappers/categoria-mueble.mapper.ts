import { CategoriaMueble } from "../../domain/entities/categoria-mueble.entity";

export type CategoriaMueblePrismaRow = {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapCategoriaMuebleFromPrisma(data: CategoriaMueblePrismaRow): CategoriaMueble {
  return new CategoriaMueble(
    data.id,
    data.nombre,
    data.createdAt,
    data.updatedAt,
  );
}
