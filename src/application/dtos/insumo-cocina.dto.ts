import type { InsumoCocina, MovimientoCocina, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../domain/entities/insumo-cocina.entity";

export interface CreateInsumoCocinaDto {
  codigo: string;
  nombre: string;
  unidad: UnidadInsumo;
  stock_actual?: number;
  stock_minimo?: number;
  notas?: string;
}

export interface UpdateInsumoCocinaDto {
  codigo?: string;
  nombre?: string;
  unidad?: UnidadInsumo;
  stock_actual?: number;
  stock_minimo?: number;
  notas?: string;
  activo?: boolean;
}

export interface InsumoCocinaDto {
  id: string;
  codigo: string;
  nombre: string;
  unidad: UnidadInsumo;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMovimientoCocinaDto {
  insumo_id: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo_entrada?: MotivoEntrada;
  motivo_salida?: MotivoSalida;
  notas?: string;
}

export interface MovimientoCocinaDto {
  id: string;
  insumo_id: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo_entrada: MotivoEntrada | null;
  motivo_salida: MotivoSalida | null;
  notas: string | null;
  created_at: string;
}

export interface MovimientoCocinaFiltersDto {
  insumo_id?: string;
  tipo?: TipoMovimiento;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export function toInsumoCocinaDto(i: InsumoCocina): InsumoCocinaDto {
  return {
    id: i.id,
    codigo: i.codigo,
    nombre: i.nombre,
    unidad: i.unidad,
    stock_actual: i.stockActual,
    stock_minimo: i.stockMinimo,
    activo: i.activo,
    notas: i.notas,
    created_at: i.createdAt.toISOString(),
    updated_at: i.updatedAt.toISOString(),
  };
}

export function toMovimientoCocinaDto(m: MovimientoCocina): MovimientoCocinaDto {
  return {
    id: m.id,
    insumo_id: m.insumoId,
    tipo: m.tipo,
    cantidad: m.cantidad,
    motivo_entrada: m.motivoEntrada,
    motivo_salida: m.motivoSalida,
    notas: m.notas,
    created_at: m.createdAt.toISOString(),
  };
}