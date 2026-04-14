import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindPromocionByIdUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository) {}

  async execute(id: string): Promise<PromocionDto> {
    const promocion = await this.repository.findById(id);
    if (!promocion) {
      throw PromocionException.notFoundById();
    }

    return toPromocionDto(promocion);
  }
}
