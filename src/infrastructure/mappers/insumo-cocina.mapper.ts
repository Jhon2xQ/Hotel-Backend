import { InsumoCocina, MovimientoCocina, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../domain/entities/insumo-cocina.entity";
import type { InsumoCocina as PrismaInsumoCocina, MovimientoCocina as PrismaMovimientoCocina } from "../../../generated/prisma/client";

export function mapInsumoCocinaFromPrisma(p: PrismaInsumoCocina): InsumoCocina {
  return new InsumoCocina(
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

export function mapMovimientoCocinaFromPrisma(m: PrismaMovimientoCocina): MovimientoCocina {
  return new MovimientoCocina(
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