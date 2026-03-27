import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { PaginatedResult, PaginationParams } from "../../../common/types/pagination.types";
import { Huesped } from "../../../domain/entities/huesped.entity";

export class ListHuespedPaginatedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Huesped>> {
    return await this.repository.findAllPaginated(params);
  }
}
