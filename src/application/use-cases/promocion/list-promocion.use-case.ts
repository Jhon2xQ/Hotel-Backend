import { inject, injectable } from "tsyringe";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListPromocionUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private readonly repository: IPromocionRepository) {}

  async execute(): Promise<PromocionDto[]> {
    const results = await this.repository.findAll();
    return results.map((p) => toPromocionDto(p, p.habitaciones));
  }
}
