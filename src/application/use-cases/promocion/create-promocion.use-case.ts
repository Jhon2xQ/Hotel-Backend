import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { CreatePromocionDto, PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreatePromocionUseCase {
  constructor(
    @inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

  async execute(input: CreatePromocionDto): Promise<PromocionDto> {
    const existingPromocion = await this.repository.findByCodigo(input.codigo);
    if (existingPromocion) {
      throw PromocionException.duplicateCodigo();
    }

    if (input.habitaciones && input.habitaciones.length > 0) {
      for (const habitacionId of input.habitaciones) {
        const habitacion = await this.habitacionRepository.findById(habitacionId);
        if (!habitacion) {
          throw HabitacionException.notFoundById();
        }
      }
    }

    const promocion = await this.repository.create({
      codigo: input.codigo,
      tipoDescuento: input.tipo_descuento,
      valorDescuento: input.valor_descuento,
      vigDesde: input.vig_desde,
      vigHasta: input.vig_hasta,
      estado: input.estado ?? true,
      habitaciones: input.habitaciones,
    });

    return toPromocionDto(promocion, promocion.habitaciones);
  }
}
