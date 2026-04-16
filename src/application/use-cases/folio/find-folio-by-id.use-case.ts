import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { FolioDto, toFolioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindFolioByIdUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(id: string): Promise<FolioDto> {
    const folio = await this.repository.findById(id);
    if (!folio) {
      throw FolioException.notFoundById(id);
    }
    return toFolioDto(folio);
  }
}