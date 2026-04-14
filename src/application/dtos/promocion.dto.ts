import type { Promocion } from "../../domain/entities/promocion.entity";

export interface CreatePromocionDto {
  codigo: string;
  tipo_descuento: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento: number;
  vig_desde: Date;
  vig_hasta: Date;
  estado?: boolean;
  habitaciones?: string[];
}

export interface UpdatePromocionDto {
  codigo?: string;
  tipo_descuento?: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento?: number;
  vig_desde?: Date;
  vig_hasta?: Date;
  estado?: boolean;
  habitaciones?: string[];
}

export interface PromocionDto {
  id: string;
  codigo: string;
  tipo_descuento: "PORCENTAJE" | "MONTO_FIJO";
  valor_descuento: number;
  vig_desde: string;
  vig_hasta: string;
  estado: boolean;
  habitaciones: string[];
  created_at: string;
  updated_at: string;
}

export function toPromocionDto(p: Promocion, habitaciones: string[] = []): PromocionDto {
  return {
    id: p.id,
    codigo: p.codigo,
    tipo_descuento: p.tipoDescuento as "PORCENTAJE" | "MONTO_FIJO",
    valor_descuento: p.valorDescuento,
    vig_desde: p.vigDesde.toISOString(),
    vig_hasta: p.vigHasta.toISOString(),
    estado: p.estado,
    habitaciones,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  };
}
