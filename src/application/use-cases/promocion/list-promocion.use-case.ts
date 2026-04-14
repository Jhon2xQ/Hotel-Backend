import { inject, injectable } from "tsyringe";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import type { PaginatedResult, PaginationParams } from "../../paginations/api.pagination";
import { PromocionDto, toPromocionDto } from "../../dtos/promocion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListPromocionUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private readonly repository: IPromocionRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<PromocionDto>> {
    const result = await this.repository.findAll(params);
    return {
      list: result.list.map((p) => toPromocionDto(p)),
      pagination: result.pagination,
    };
  }
}
