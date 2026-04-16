import { inject, injectable } from "tsyringe";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { FolioDto, toFolioDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(): Promise<FolioDto[]> {
    const folios = await this.repository.findAll();
    return folios.map(toFolioDto);
  }
}