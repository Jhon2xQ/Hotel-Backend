import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { Promocion } from "../../../domain/entities/promocion.entity";
import { CobrarResponseDto, toFolioDto, toFolioProductoDto, toFolioServicioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

function calcularDescuento(subtotal: number, promociones: Promocion[]): {
  descuento: number;
  total: number;
} {
  let descuento = 0;

  const ahora = new Date();

  for (const promo of promociones) {
    if (!promo.estado) continue;

    const vigDesde = new Date(promo.vigDesde);
    const vigHasta = new Date(promo.vigHasta);

    if (ahora < vigDesde || ahora > vigHasta) continue;

    if (promo.tipoDescuento === "PORCENTAJE") {
      descuento += subtotal * (promo.valorDescuento / 100);
    } else if (promo.tipoDescuento === "MONTO_FIJO") {
      descuento += promo.valorDescuento;
    }
  }

  const total = Math.max(0, subtotal - descuento);

  return {
    descuento: Math.round(descuento * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

@injectable()
export class GetConsumosFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(folioId: string): Promise<CobrarResponseDto> {
    const folio = await this.repository.findById(folioId);
    if (!folio) {
      throw FolioException.notFoundById(folioId);
    }

    const consumos = await this.repository.getConsumos(folioId);
    const subtotal = await this.repository.getTotal(folioId);

    const { descuento, total } = calcularDescuento(subtotal, folio.promociones);

    return {
      folio: toFolioDto(folio),
      productos: consumos.productos.map(toFolioProductoDto),
      servicios: consumos.servicios.map(toFolioServicioDto),
      subtotal,
      descuento,
      total,
    };
  }
}
