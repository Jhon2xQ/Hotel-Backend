import type { Folio } from "../entities/folio.entity";
import type { PaginatedResult, PaginationParams } from "../../application/paginations/api.pagination";

export interface FolioPaginationParams extends PaginationParams {
  reservaId?: string;
  estado?: boolean;
}

export interface CreateFolioParams {
  reservaId: string;
  estado?: boolean;
  observacion?: string;
  promocionIds?: string[];
}

export interface UpdateFolioParams {
  estado?: boolean;
  observacion?: string;
  promocionIds?: string[];
}

export interface FolioWithPromociones {
  id: string;
  nroFolio: number;
  reservaId: string;
  estado: boolean;
  observacion: string | null;
  cerradoEn: Date | null;
  createdAt: Date;
  updatedAt: Date;
  promociones: string[];
}

export interface IFolioRepository {
  create(data: CreateFolioParams): Promise<FolioWithPromociones>;
  findAll(): Promise<FolioWithPromociones[]>;
  findAllPaginated(params: FolioPaginationParams): Promise<PaginatedResult<FolioWithPromociones>>;
  findById(id: string): Promise<FolioWithPromociones | null>;
  findByReservaId(reservaId: string): Promise<FolioWithPromociones[]>;
  update(id: string, data: UpdateFolioParams): Promise<FolioWithPromociones>;
  delete(id: string): Promise<void>;
  close(id: string): Promise<FolioWithPromociones>;
}