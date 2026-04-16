import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { CreateFolioServicioDto, FolioServicioDto, toFolioServicioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class AddServicioFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(folioId: string, input: CreateFolioServicioDto): Promise<FolioServicioDto> {
    const folio = await this.repository.findById(folioId);
    if (!folio) {
      throw FolioException.notFoundById(folioId);
    }

    if (!folio.estado) {
      throw FolioException.cannotModifyClosed();
    }

    const folioServicio = await this.repository.addServicio({
      folioId,
      concepto: input.concepto,
      cantidad: input.cantidad,
      precioUnit: input.precioUnit,
    });

    return toFolioServicioDto(folioServicio);
  }
}
