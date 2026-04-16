import type { InsumoBar, MovimientoBar, UnidadInsumo, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../domain/entities/insumo-bar.entity";

export interface CreateInsumoBarDto {
  codigo: string;
  nombre: string;
  unidad: UnidadInsumo;
  stock_actual?: number;
  stock_minimo?: number;
  notas?: string;
}

export interface UpdateInsumoBarDto {
  codigo?: string;
  nombre?: string;
  unidad?: UnidadInsumo;
  stock_actual?: number;
  stock_minimo?: number;
  notas?: string;
  activo?: boolean;
}

export interface InsumoBarDto {
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

export interface CreateMovimientoBarDto {
  insumo_id: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo_entrada?: MotivoEntrada;
  motivo_salida?: MotivoSalida;
  notas?: string;
}

export interface MovimientoBarDto {
  id: string;
  insumo_id: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo_entrada: MotivoEntrada | null;
  motivo_salida: MotivoSalida | null;
  notas: string | null;
  created_at: string;
}

export interface MovimientoBarFiltersDto {
  insumo_id?: string;
  tipo?: TipoMovimiento;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export function toInsumoBarDto(i: InsumoBar): InsumoBarDto {
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

export function toMovimientoBarDto(m: MovimientoBar): MovimientoBarDto {
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