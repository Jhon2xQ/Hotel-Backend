import type { FolioWithPromociones } from "../../domain/interfaces/folio.repository.interface";

export interface CreateFolioDto {
  reserva_id: string;
  observacion?: string;
  promocion_ids?: string[];
}

export interface UpdateFolioDto {
  estado?: boolean;
  observacion?: string;
  promocion_ids?: string[];
}

export interface FolioDto {
  id: string;
  nro_folio: number;
  reserva_id: string;
  estado: boolean;
  observacion: string | null;
  cerrado_en: string | null;
  promociones: string[];
  created_at: string;
  updated_at: string;
}

export function toFolioDto(f: FolioWithPromociones): FolioDto {
  return {
    id: f.id,
    nro_folio: f.nroFolio,
    reserva_id: f.reservaId,
    estado: f.estado,
    observacion: f.observacion,
    cerrado_en: f.cerradoEn ? f.cerradoEn.toISOString() : null,
    promociones: f.promociones,
    created_at: f.createdAt.toISOString(),
    updated_at: f.updatedAt.toISOString(),
  };
}