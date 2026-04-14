import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { UpdatePromocionDto, PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdatePromocionUseCase {
  constructor(
    @inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

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

    if (input.habitaciones && input.habitaciones.length > 0) {
      for (const habitacionId of input.habitaciones) {
        const habitacion = await this.habitacionRepository.findById(habitacionId);
        if (!habitacion) {
          throw HabitacionException.notFoundById();
        }
      }
    }

    const promocion = await this.repository.update(id, {
      codigo: input.codigo,
      tipoDescuento: input.tipo_descuento,
      valorDescuento: input.valor_descuento,
      vigDesde: input.vig_desde,
      vigHasta: input.vig_hasta,
      estado: input.estado,
      habitaciones: input.habitaciones,
    });

    return toPromocionDto(promocion, promocion.habitaciones);
  }
}
