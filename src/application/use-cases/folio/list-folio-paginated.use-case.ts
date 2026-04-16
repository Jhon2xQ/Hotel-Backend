import { inject, injectable } from "tsyringe";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { FolioPaginationParams } from "../../../domain/interfaces/folio.repository.interface";
import { FolioPaginatedDto, toFolioPaginatedDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListFolioPaginatedUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(params: FolioPaginationParams): Promise<FolioPaginatedDto> {
    const result = await this.repository.findAllPaginated(params);
    return toFolioPaginatedDto(result);
  }
}