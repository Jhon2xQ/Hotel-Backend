import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { UpdateFolioDto, FolioDto, toFolioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateFolioUseCase {
  constructor(
    @inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository,
    @inject(DI_TOKENS.IPromocionRepository) private promocionRepository: IPromocionRepository,
  ) {}

  async execute(id: string, input: UpdateFolioDto): Promise<FolioDto> {
    const existingFolio = await this.repository.findById(id);
    if (!existingFolio) {
      throw FolioException.notFoundById(id);
    }

    if (existingFolio.estado === false && input.estado !== undefined && input.estado === true) {
      throw FolioException.alreadyClosed();
    }

    if (input.promocionIds && input.promocionIds.length > 0) {
      for (const promocionId of input.promocionIds) {
        const promocion = await this.promocionRepository.findById(promocionId);
        if (!promocion) {
          throw FolioException.promocionNotFound();
        }
      }
    }

    const folio = await this.repository.update(id, {
      estado: input.estado,
      observacion: input.observacion,
      promocionIds: input.promocionIds,
    });

    return toFolioDto(folio);
  }
}