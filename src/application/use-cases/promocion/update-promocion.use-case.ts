import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { UpdatePromocionDto, PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdatePromocionUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository) {}

  async execute(id: string, input: UpdatePromocionDto): Promise<PromocionDto> {
    const existingPromocion = await this.repository.findById(id);
    if (!existingPromocion) {
      throw PromocionException.notFoundById();
    }

    if (input.codigo && input.codigo !== existingPromocion.codigo) {
      const duplicatePromocion = await this.repository.findByCodigo(input.codigo);
      if (duplicatePromocion) {
        throw PromocionException.duplicateCodigo();
      }
    }

    const promocion = await this.repository.update(id, {
      codigo: input.codigo,
      tipoDescuento: input.tipo_descuento,
      valorDescuento: input.valor_descuento,
      vigDesde: input.vig_desde,
      vigHasta: input.vig_hasta,
      estado: input.estado,
      habitacionIds: input.habitacion_ids,
    });

    return toPromocionDto(promocion);
  }
}
