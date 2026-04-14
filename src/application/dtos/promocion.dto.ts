import type { Promocion } from "../../domain/entities/promocion.entity";

export interface CreatePromocionDto {
  codigo: string;
  tipo_descuento: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento: number;
  vig_desde: Date;
  vig_hasta: Date;
  estado?: boolean;
  habitacion_ids?: string[];
}

export interface UpdatePromocionDto {
  codigo?: string;
  tipo_descuento?: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento?: number;
  vig_desde?: Date;
  vig_hasta?: Date;
  estado?: boolean;
  habitacion_ids?: string[];
}

export interface PromocionDto {
  id: string;
  codigo: string;
  tipo_descuento: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento: number;
  vig_desde: string;
  vig_hasta: string;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

export function toPromocionDto(p: Promocion): PromocionDto {
  return {
    id: p.id,
    codigo: p.codigo,
    tipo_descuento: p.tipoDescuento as "PORCENTAJE" | "MONTO_FIJO",
    valor_descuento: p.valorDescuento,
    vig_desde: p.vigDesde.toISOString(),
    vig_hasta: p.vigHasta.toISOString(),
    estado: p.estado,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  };
}
