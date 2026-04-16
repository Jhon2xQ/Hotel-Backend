import { InsumoBar, MovimientoBar, TipoMovimiento, MotivoEntrada, MotivoSalida } from "../entities/insumo-bar.entity";

export interface CreateInsumoBarParams {
  codigo: string;
  nombre: string;
  unidad: string;
  stockActual?: number;
  stockMinimo?: number;
  notas?: string | null;
}

export interface UpdateInsumoBarParams {
  codigo?: string;
  nombre?: string;
  unidad?: string;
  stockActual?: number;
  stockMinimo?: number;
  notas?: string | null;
  activo?: boolean;
}

export interface CreateMovimientoBarParams {
  insumoId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivoEntrada?: MotivoEntrada | null;
  motivoSalida?: MotivoSalida | null;
  notas?: string | null;
}

export interface MovimientoBarFilters {
  insumoId?: string;
  tipo?: TipoMovimiento;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface IInsumoBarRepository {
  create(data: CreateInsumoBarParams): Promise<InsumoBar>;
  findAll(): Promise<InsumoBar[]>;
  findById(id: string): Promise<InsumoBar | null>;
  findByCodigo(codigo: string): Promise<InsumoBar | null>;
  update(id: string, data: UpdateInsumoBarParams): Promise<InsumoBar>;
  delete(id: string): Promise<void>;
  createMovimiento(data: CreateMovimientoBarParams): Promise<MovimientoBar>;
  findMovimientos(filters: MovimientoBarFilters): Promise<MovimientoBar[]>;
  findMovimientosByInsumo(insumoId: string): Promise<MovimientoBar[]>;
}