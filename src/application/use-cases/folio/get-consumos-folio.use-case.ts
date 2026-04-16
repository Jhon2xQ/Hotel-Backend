import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { CobrarResponseDto, FolioDto, toFolioDto, toFolioProductoDto, toFolioServicioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class GetConsumosFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(folioId: string): Promise<CobrarResponseDto> {
    const folio = await this.repository.findById(folioId);
    if (!folio) {
      throw FolioException.notFoundById(folioId);
    }

    const consumos = await this.repository.getConsumos(folioId);
    const total = await this.repository.getTotal(folioId);

    return {
      folio: toFolioDto(folio),
      productos: consumos.productos.map(toFolioProductoDto),
      servicios: consumos.servicios.map(toFolioServicioDto),
      total,
    };
  }
}
