import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { FolioDto, toFolioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CloseFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(id: string, observacion?: string): Promise<FolioDto> {
    const existingFolio = await this.repository.findById(id);
    if (!existingFolio) {
      throw FolioException.notFoundById(id);
    }

    if (existingFolio.estado === false) {
      throw FolioException.alreadyClosed();
    }

    const folio = await this.repository.close(id);

    if (observacion) {
      return toFolioDto(
        await this.repository.update(id, { observacion }),
      );
    }

    return toFolioDto(folio);
  }
}