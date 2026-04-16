import { inject, injectable } from "tsyringe";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { FolioPaginatedDto, ListFolioDto, toFolioPaginatedDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(input?: ListFolioDto): Promise<FolioPaginatedDto> {
    const result = await this.repository.findAllPaginated({
      page: input?.page ?? 1,
      limit: input?.limit ?? 10,
      reservaId: input?.reserva_id,
      estado: input?.estado,
    });
    return toFolioPaginatedDto(result);
  }
}