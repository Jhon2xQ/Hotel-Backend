import { inject, injectable } from "tsyringe";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import type { MueblePaginationParams } from "../../../domain/interfaces/mueble.repository.interface";
import type { PaginatedResult } from "../../paginations/api.pagination";
import { MuebleDto, toMuebleDto } from "../../dtos/mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListMueblePaginatedUseCase {
  constructor(@inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository) {}

  async execute(params: MueblePaginationParams): Promise<PaginatedResult<MuebleDto>> {
    const result = await this.repository.findAllPaginated(params);
    return {
      list: result.list.map((m) => toMuebleDto(m)),
      pagination: result.pagination,
    };
  }
}