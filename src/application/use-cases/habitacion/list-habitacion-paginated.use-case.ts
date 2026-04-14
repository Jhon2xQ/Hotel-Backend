import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { PaginatedResult } from "../../paginations/api.pagination";
import { toHabitacionDto, type HabitacionDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListHabitacionPaginatedUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(params: { page: number; limit: number; tipo?: string }): Promise<PaginatedResult<HabitacionDto>> {
    const result = await this.repository.findAllPaginated(params);
    return {
      list: result.list.map((h) => toHabitacionDto(h, [], h.promociones)),
      pagination: result.pagination,
    };
  }
}
