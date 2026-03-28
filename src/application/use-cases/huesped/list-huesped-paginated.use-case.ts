import { inject, injectable } from "tsyringe";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { PaginatedResult, PaginationParams } from "../../../common/types/pagination.types";
import { Huesped } from "../../../domain/entities/huesped.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListHuespedPaginatedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Huesped>> {
    return await this.repository.findAllPaginated(params);
  }
}
