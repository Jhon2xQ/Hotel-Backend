import type { Folio } from "../entities/folio.entity";

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
  findById(id: string): Promise<FolioWithPromociones | null>;
  findByReservaId(reservaId: string): Promise<FolioWithPromociones[]>;
  update(id: string, data: UpdateFolioParams): Promise<FolioWithPromociones>;
  delete(id: string): Promise<void>;
  close(id: string): Promise<FolioWithPromociones>;
}