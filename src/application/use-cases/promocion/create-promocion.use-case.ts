import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { CreatePromocionDto, PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreatePromocionUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository) {}

  async execute(input: CreatePromocionDto): Promise<PromocionDto> {
    const existingPromocion = await this.repository.findByCodigo(input.codigo);
    if (existingPromocion) {
      throw PromocionException.duplicateCodigo();
    }

    const promocion = await this.repository.create({
      codigo: input.codigo,
      tipoDescuento: input.tipo_descuento,
      valorDescuento: input.valor_descuento,
      vigDesde: input.vig_desde,
      vigHasta: input.vig_hasta,
      estado: input.estado ?? true,
      habitacionIds: input.habitacion_ids,
    });

    return toPromocionDto(promocion);
  }
}
