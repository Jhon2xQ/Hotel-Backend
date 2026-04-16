import { InsumoCocina, MovimientoCocina, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../entities/insumo-cocina.entity";

export interface CreateInsumoCocinaParams {
  codigo: string;
  nombre: string;
  unidad: string;
  stockActual?: number;
  stockMinimo?: number;
  notas?: string | null;
}

export interface UpdateInsumoCocinaParams {
  codigo?: string;
  nombre?: string;
  unidad?: string;
  stockActual?: number;
  stockMinimo?: number;
  notas?: string | null;
  activo?: boolean;
}

export interface CreateMovimientoCocinaParams {
  insumoId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivoEntrada?: MotivoEntrada | null;
  motivoSalida?: MotivoSalida | null;
  notas?: string | null;
}

export interface MovimientoCocinaFilters {
  insumoId?: string;
  tipo?: TipoMovimiento;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface IInsumoCocinaRepository {
  create(data: CreateInsumoCocinaParams): Promise<InsumoCocina>;
  findAll(): Promise<InsumoCocina[]>;
  findById(id: string): Promise<InsumoCocina | null>;
  findByCodigo(codigo: string): Promise<InsumoCocina | null>;
  update(id: string, data: UpdateInsumoCocinaParams): Promise<InsumoCocina>;
  delete(id: string): Promise<void>;
  createMovimiento(data: CreateMovimientoCocinaParams): Promise<MovimientoCocina>;
  findMovimientos(filters: MovimientoCocinaFilters): Promise<MovimientoCocina[]>;
  findMovimientosByInsumo(insumoId: string): Promise<MovimientoCocina[]>;
}