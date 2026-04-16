import { Producto } from "../../domain/entities/producto.entity";
import type { Producto as PrismaProducto } from "../../../generated/prisma/client";

export function mapProductoFromPrisma(p: PrismaProducto): Producto {
  return new Producto(
    p.id,
    p.codigo,
    p.nombre,
    p.descripcion ?? null,
    Number(p.precioUnitario),
    p.stock,
    p.createdAt,
    p.updatedAt,
  );
}