import type { Folio } from "../entities/folio.entity";
import type { FolioProducto } from "../entities/folio-producto.entity";
import type { FolioServicio } from "../entities/folio-servicio.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface FolioPaginationParams extends PaginationParams {
  estanciaId?: string;
  estado?: boolean;
}

export interface CreateFolioParams {
  estanciaId: string;
  estado?: boolean;
  observacion?: string;
  promocionIds?: string[];
}

export interface UpdateFolioParams {
  estado?: boolean;
  observacion?: string;
  promocionIds?: string[];
}

export interface FolioWithRelations {
  id: string;
  codigo: string;
  estanciaId: string;
  pagoId: string | null;
  estado: boolean;
  observacion: string | null;
  cerradoEn: Date | null;
  createdAt: Date;
  updatedAt: Date;
  promociones: string[];
}

export interface FolioWithConsumos extends FolioWithRelations {
  productos: FolioProducto[];
  servicios: FolioServicio[];
  total: number;
}

export interface CreateFolioProductoParams {
  folioId: string;
  productoId: string;
  cantidad: number;
  precioUnit: number;
}

export interface CreateFolioServicioParams {
  folioId: string;
  concepto: string;
  cantidad: number;
  precioUnit: number;
}

export interface IFolioRepository {
  create(data: CreateFolioParams): Promise<FolioWithRelations>;
  findAll(): Promise<FolioWithRelations[]>;
  findAllPaginated(params: FolioPaginationParams): Promise<PaginatedResult<FolioWithRelations>>;
  findById(id: string): Promise<FolioWithRelations | null>;
  findByEstanciaId(estanciaId: string): Promise<FolioWithRelations[]>;
  findByCodigo(codigo: string): Promise<FolioWithRelations | null>;
  findOpenByEstanciaId(estanciaId: string): Promise<FolioWithRelations | null>;
  update(id: string, data: UpdateFolioParams): Promise<FolioWithRelations>;
  delete(id: string): Promise<void>;
  addProducto(data: CreateFolioProductoParams): Promise<FolioProducto>;
  addServicio(data: CreateFolioServicioParams): Promise<FolioServicio>;
  getConsumos(folioId: string): Promise<{ productos: FolioProducto[]; servicios: FolioServicio[] }>;
  getTotal(folioId: string): Promise<number>;
  closeWithPago(id: string, pagoId: string): Promise<FolioWithRelations>;
}
