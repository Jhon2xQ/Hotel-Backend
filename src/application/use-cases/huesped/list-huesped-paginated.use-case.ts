import { inject, injectable } from "tsyringe";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import type { PaginatedResult, PaginationParams } from "../../paginations/api.pagination";
import { HuespedDto, toHuespedDto } from "../../dtos/huesped.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListHuespedPaginatedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<HuespedDto>> {
    const result = await this.repository.findAllPaginated(params);
    return {
      list: result.list.map((h) => toHuespedDto(h)),
      pagination: result.pagination,
    };
  }
}
