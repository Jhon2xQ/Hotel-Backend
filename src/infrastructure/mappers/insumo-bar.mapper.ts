import { InsumoBar, MovimientoBar, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../domain/entities/insumo-bar.entity";
import type { InsumoBar as PrismaInsumoBar, MovimientoBar as PrismaMovimientoBar } from "../../../generated/prisma/client";

export function mapInsumoBarFromPrisma(p: PrismaInsumoBar): InsumoBar {
  return new InsumoBar(
    p.id,
    p.codigo,
    p.nombre,
    p.unidad as UnidadInsumo,
    Number(p.stockActual),
    Number(p.stockMinimo),
    p.activo,
    p.notas ?? null,
    p.createdAt,
    p.updatedAt,
  );
}

export function mapMovimientoBarFromPrisma(m: PrismaMovimientoBar): MovimientoBar {
  return new MovimientoBar(
    m.id,
    m.insumoId,
    m.tipo as TipoMovimiento,
    Number(m.cantidad),
    m.motivoEntrada as MotivoEntrada | null,
    m.motivoSalida as MotivoSalida | null,
    m.notas ?? null,
    m.createdAt,
  );
}