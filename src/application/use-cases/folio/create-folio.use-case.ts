import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { CreateFolioDto, FolioDto, toFolioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

function validarPromocion(promocion: { estado: boolean; vigDesde: Date; vigHasta: Date }): void {
  if (!promocion.estado) {
    throw FolioException.promocionInactive();
  }

  const ahora = new Date();
  const vigDesde = new Date(promocion.vigDesde);
  const vigHasta = new Date(promocion.vigHasta);

  if (ahora > vigHasta) {
    throw FolioException.promocionExpired();
  }

  if (ahora < vigDesde) {
    throw FolioException.promocionNotYetAvailable();
  }
}

@injectable()
export class CreateFolioUseCase {
  constructor(
    @inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository,
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
    @inject(DI_TOKENS.IPromocionRepository) private promocionRepository: IPromocionRepository,
  ) {}

  async execute(input: CreateFolioDto): Promise<FolioDto> {
    const reserva = await this.reservaRepository.findById(input.reservaId);
    if (!reserva) {
      throw FolioException.reservaNotFound();
    }

    if (input.promocionIds && input.promocionIds.length > 0) {
      for (const promocionId of input.promocionIds) {
        const promocion = await this.promocionRepository.findById(promocionId);
        if (!promocion) {
          throw FolioException.promocionNotFound();
        }
        validarPromocion(promocion);
      }
    }

    const folio = await this.repository.create({
      reservaId: input.reservaId,
      observacion: input.observacion,
      promocionIds: input.promocionIds,
    });

    return toFolioDto(folio);
  }
}
