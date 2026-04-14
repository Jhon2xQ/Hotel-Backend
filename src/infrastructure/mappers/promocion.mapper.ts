import { Prisma } from "../../../generated/prisma/client";
import { Promocion } from "../../domain/entities/promocion.entity";

export type PromocionPrismaRow = {
  id: string;
  codigo: string;
  tipoDescuento: string;
  valorDescuento: Prisma.Decimal;
  vigDesde: Date;
  vigHasta: Date;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function mapPromocionFromPrisma(data: PromocionPrismaRow): Promocion {
  return new Promocion(
    data.id,
    data.codigo,
    data.tipoDescuento,
    Number(data.valorDescuento),
    data.vigDesde,
    data.vigHasta,
    data.estado,
    data.createdAt,
    data.updatedAt,
  );
}
