import type { FolioWithRelations } from "../../domain/interfaces/folio.repository.interface";

export interface CreateFolioDto {
  estanciaId: string;
  observacion?: string;
  promocionIds?: string[];
}

export interface UpdateFolioDto {
  estado?: boolean;
  observacion?: string;
  promocionIds?: string[];
}

export interface ListFolioDto {
  page?: number;
  limit?: number;
  estanciaId?: string;
  estado?: boolean;
}

export interface FolioDto {
  id: string;
  codigo: string;
  estanciaId: string;
  pagoId: string | null;
  estado: boolean;
  observacion: string | null;
  cerradoEn: string | null;
  promociones: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FolioWithConsumosDto extends FolioDto {
  productos: FolioProductoDto[];
  servicios: FolioServicioDto[];
  total: number;
}

export interface FolioPaginatedDto {
  list: FolioDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function toFolioDto(f: FolioWithRelations): FolioDto {
  return {
    id: f.id,
    codigo: f.codigo,
    estanciaId: f.estanciaId,
    pagoId: f.pagoId,
    estado: f.estado,
    observacion: f.observacion,
    cerradoEn: f.cerradoEn ? f.cerradoEn.toISOString() : null,
    promociones: f.promociones,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export function toFolioPaginatedDto(
  result: {
    list: FolioWithRelations[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
  },
): FolioPaginatedDto {
  return {
    list: result.list.map(toFolioDto),
    pagination: result.pagination,
  };
}

export interface CreateFolioProductoDto {
  productoId: string;
  cantidad: number;
  precioUnit: number;
}

export interface FolioProductoDto {
  id: string;
  folioId: string;
  productoId: string;
  cantidad: number;
  precioUnit: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export function toFolioProductoDto(fp: {
  id: string;
  folioId: string;
  productoId: string;
  cantidad: number;
  precioUnit: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}): FolioProductoDto {
  return {
    id: fp.id,
    folioId: fp.folioId,
    productoId: fp.productoId,
    cantidad: fp.cantidad,
    precioUnit: fp.precioUnit,
    total: fp.total,
    createdAt: fp.createdAt.toISOString(),
    updatedAt: fp.updatedAt.toISOString(),
  };
}

export interface CreateFolioServicioDto {
  concepto: string;
  cantidad: number;
  precioUnit: number;
}

export interface FolioServicioDto {
  id: string;
  folioId: string;
  concepto: string;
  cantidad: number;
  precioUnit: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export function toFolioServicioDto(fs: {
  id: string;
  folioId: string;
  concepto: string;
  cantidad: number;
  precioUnit: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}): FolioServicioDto {
  return {
    id: fs.id,
    folioId: fs.folioId,
    concepto: fs.concepto,
    cantidad: fs.cantidad,
    precioUnit: fs.precioUnit,
    total: fs.total,
    createdAt: fs.createdAt.toISOString(),
    updatedAt: fs.updatedAt.toISOString(),
  };
}

export interface CobrarResponseDto {
  folio: FolioDto;
  productos: FolioProductoDto[];
  servicios: FolioServicioDto[];
  total: number;
}
